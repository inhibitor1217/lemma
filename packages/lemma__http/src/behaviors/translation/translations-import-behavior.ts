import { FileStorageClient, FileStorageLocation } from '@lemma/file-storage-client';
import { Either, go, TaskEither } from '@lemma/fx';
import { TranslationsImportAttempt, TranslationsImportAttemptStatus, TranslationsImportAttemptType } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import { InvalidFileMIMETypeException, TranslationsImportException } from './translations-import-behavior.exception';

type TriggerImportFromJsonFile = {
  Args: {
    requestKey: string;
    workspaceId: number;
    memberId: number;
    language: string;
    mimetype: string;
    buffer: Buffer;
  };
  Result: {
    translationsImportAttempt: TranslationsImportAttempt;
  };
  Error: InvalidFileMIMETypeException | TranslationsImportException;
};

declare module 'fastify' {
  interface FastifyInstance {
    translationsImportBehavior: {
      triggerImportFromJsonFile: (
        args: TriggerImportFromJsonFile['Args']
      ) => TaskEither<TriggerImportFromJsonFile['Result'], TriggerImportFromJsonFile['Error']>;
    };
  }
}

export async function translationsImportBehavior(fastify: FastifyInstance) {
  function translationImportFileKey(args: { workspaceId: number; format: 'json'; language: string; requestKey: string }): string {
    return ['workspace', args.workspaceId, 'translation', 'import', `${args.requestKey}.${args.language}.${args.format}`].join(
      '/'
    );
  }

  function triggerImportFromJsonFile(
    args: TriggerImportFromJsonFile['Args']
  ): TaskEither<TriggerImportFromJsonFile['Result'], TriggerImportFromJsonFile['Error']> {
    const { requestKey, workspaceId, memberId, language, mimetype, buffer } = args;

    if (mimetype !== 'application/json') {
      return TaskEither.error(
        new InvalidFileMIMETypeException({
          mimetype,
          expectedMimeType: 'application/json',
        })
      );
    }

    const uploadFileTask = () =>
      fastify.fileStorage
        .uploadFile(
          FileStorageLocation.Internal,
          translationImportFileKey({
            workspaceId,
            format: 'json',
            language,
            requestKey,
          }),
          buffer
        )
        .then(Either.mapOr((e) => new TranslationsImportException({}, e)));

    const createTranslationsImportAttemptTask = (uploadResult: FileStorageClient.UploadFileResult) => () =>
      fastify.rdb.translationsImportAttempt
        .create({
          data: {
            workspaceId,
            status: TranslationsImportAttemptStatus.IN_PROGRESS,
            issuerId: memberId,
            type: TranslationsImportAttemptType.FILE_JSON,
            details: {
              language,
              fileUri: uploadResult.httpUri,
            },
          },
        })
        .then(Either.ok)
        .catch((e) => Either.error(new TranslationsImportException({}, e)));

    const triggerImportTranslationsFromFileTask = (translationsImportAttempt: TranslationsImportAttempt) => () =>
      fastify.fnImportTranslationsFromFile
        .asyncInvoke({
          payload: {
            workspaceId,
            translationsImportAttemptId: translationsImportAttempt.id,
            file: {
              type: 'json',
              key: translationImportFileKey({
                workspaceId,
                format: 'json',
                language,
                requestKey,
              }),
            },
            translations: {
              language,
            },
          },
        })
        .then(Either.ok)
        .catch((e) => Either.error(new TranslationsImportException({}, e)));

    /**
     * @note
     *
     * Uploading a file to file storage is idempotent,
     * (since we are using requestKey)
     * so it is safe to not use transactions here.
     */
    return go(
      uploadFileTask,
      TaskEither.flatMapLeft(createTranslationsImportAttemptTask),
      TaskEither.chain(triggerImportTranslationsFromFileTask),
      TaskEither.mapLeft((translationsImportAttempt) => ({ translationsImportAttempt }))
    );
  }

  fastify.decorate('translationsImportBehavior', {
    triggerImportFromJsonFile,
  });
}
