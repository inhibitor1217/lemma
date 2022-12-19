import { AWSS3Client, AWSS3ClientArgs } from '@lemma/aws-s3';
import { FileStorageClient, FileStorageLocation } from '@lemma/file-storage-client';
import { Either, go, pipe, TaskEither } from '@lemma/fx';
import { Handler } from 'aws-lambda';
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

class TranslationsFileNotFoundException extends Error {
  constructor() {
    super('TranslationsFileNotFoundException');
  }
}

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
    throw new TranslationsFileNotFoundException();
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

  const result = go(getFileTask(), TaskEither.chainLeft(pipe(readFileProperties, TaskEither.flatMapLeft(logFileProperties))));

  return await result();
};
