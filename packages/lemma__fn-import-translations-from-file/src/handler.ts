import { AWSS3Client, AWSS3ClientArgs } from '@lemma/aws-s3';
import { FileStorageClient, FileStorageLocation } from '@lemma/file-storage-client';
import { Either, go, pipe, tap, TaskEither } from '@lemma/fx';
import { MongoClient, Translation } from '@lemma/mongo-client';
import { PrismaClient, TranslationsImportAttemptStatus } from '@lemma/prisma-client';
import { Handler } from 'aws-lambda';
import { TranslationsFileNotFoundException } from './exception';
import { Event, Result } from './types';

const s3 = new AWSS3Client(
  process.env.STAGE === 'dev'
    ? AWSS3ClientArgs.customEndpoint({
        endpoint: process.env.AWS_ENDPOINT || '',
        region: process.env.AWS_REGION || '',
        resourcePrefix: process.env.AWS_RESOURCE_PREFIX || '',
        logger: console,
      })
    : AWSS3ClientArgs.region({
        resourcePrefix: process.env.AWS_RESOURCE_PREFIX || '',
        region: process.env.AWS_REGION || '',
        logger: console,
      })
);

const fileStorage = new FileStorageClient(s3);

const rds = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

const mongo = new MongoClient({
  host: process.env.MONGODB_HOST || '',
  port: Number(process.env.MONGODB_PORT) || 0,
  database: process.env.MONGODB_DATABASE || '',
  username: process.env.MONGODB_USERNAME || '',
  password: process.env.MONGODB_PASSWORD || '',
  log: {
    logger: console,
    level: process.env.STAGE === 'dev' ? 'debug' : 'info',
  },
  enableMigration: false,
});

export const handler: Handler<Event, Result> = async (event, context) => {
  const {
    payload: {
      workspaceId,
      translationsImportAttemptId,
      file: { type, key },
      translations: { language },
    },
  } = event;

  if (!(await fileStorage.exists(FileStorageLocation.Internal, key))) {
    throw new TranslationsFileNotFoundException({});
  }

  const getFileTask = () => () => fileStorage.getFile(FileStorageLocation.Internal, key);

  const readFileProperties =
    (result: FileStorageClient.GetFileResult): TaskEither<{ contentType?: string; contentLength?: number }, unknown> =>
    () =>
      Promise.resolve(
        Either.ok({
          contentType: result.headers['Content-Type'],
          contentLength: result.headers['Content-Length'],
        })
      );

  const logFileProperties =
    (properties: { contentType?: string; contentLength?: number }): TaskEither<void, unknown> =>
    () => {
      console.log('Read file properties from file storage:', properties);
      return Promise.resolve(Either.ok(undefined));
    };

  const parseJsonFile =
    (result: FileStorageClient.GetFileResult): TaskEither<Record<string, string>, unknown> =>
    () =>
      result.body
        .asBuffer()
        .then((buffer) => buffer.toString('utf8'))
        .then(JSON.parse)
        .then(Either.ok)
        .catch(Either.error);

  const logNumTranslationEntries =
    (translations: Record<string, string>): TaskEither<void, unknown> =>
    () => {
      console.log(`Read ${Object.keys(translations).length} translation entries from file.`);
      return Promise.resolve(Either.ok(undefined));
    };

  const fetchTranslation = async (key: string): Promise<Translation> =>
    (await mongo.translation.findOne({
      workspaceId,
      key,
    })) ??
    new mongo.translation({
      workspaceId,
      key,
    });

  const updateTranslation = async (
    translation: Translation,
    key: string,
    value: string,
    language: string
  ): Promise<Translation> => {
    translation.translations.set(language, value);
    return await translation.save();
  };

  const processTranslationEntryTask =
    ([key, value]: [string, string]): TaskEither<void, unknown> =>
    async () => {
      try {
        const translation = await fetchTranslation(key);
        await updateTranslation(translation, key, value, language);
        return Either.ok(undefined);
      } catch (e) {
        return Either.error(e);
      }
    };

  const processTranslationEntriesTask =
    (entries: [string, string][]): TaskEither<void, unknown> =>
    () =>
      Promise.all(entries.map(processTranslationEntryTask)).then(() => Either.ok(undefined));

  const markTranslationsImportAttemptAsSucceeded: TaskEither<void, unknown> = () =>
    rds.translationsImportAttempt
      .update({
        data: {
          status: TranslationsImportAttemptStatus.SUCCESS,
          progress: 1,
        },
        where: {
          id: translationsImportAttemptId,
        },
      })
      .then(() => Either.ok(undefined))
      .catch(Either.error);

  const logTranslationsImportError = console.error;

  const markTranslationsImportAttemptAsFailed: TaskEither<void, unknown> = () =>
    rds.translationsImportAttempt
      .update({
        data: {
          status: TranslationsImportAttemptStatus.FAILED,
        },
        where: {
          id: translationsImportAttemptId,
        },
      })
      .then(() => Either.ok(undefined))
      .catch(Either.error);

  const result = go(
    getFileTask(),
    TaskEither.chainLeft(pipe(readFileProperties, TaskEither.flatMapLeft(logFileProperties))),
    TaskEither.flatMapLeft(parseJsonFile),
    TaskEither.chainLeft(logNumTranslationEntries),
    TaskEither.mapLeft(Object.entries),
    TaskEither.flatMapLeft(processTranslationEntriesTask),
    TaskEither.chainLeft(() => markTranslationsImportAttemptAsSucceeded),
    TaskEither.mapOr(pipe(tap(logTranslationsImportError), tap(markTranslationsImportAttemptAsFailed)))
  );

  return await result();
};
