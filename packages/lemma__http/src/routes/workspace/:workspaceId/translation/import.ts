import multipart, { MultipartFile, MultipartValue } from '@fastify/multipart';
import { Either, go } from '@lemma/fx';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { language } from '~/lib/translation';
import { FileStorageLocation } from '~/services/file-storage';

export default async function _import(fastify: FastifyInstance) {
  fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      files: 1,
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });

  /**
   * @api {post} /workspace/:workspaceId/translation/import/file
   * @description Import translations from a file
   *
   * @todo
   * Support import from JSON file.
   */
  fastify.post(
    '/file',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
        },
        body: {
          type: 'object',
          required: ['format', 'language', 'file'],
          properties: {
            format: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  enum: ['json'],
                },
              },
            },
            language: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  pattern: language.code.regexpStr,
                },
              },
            },
            file: {
              type: 'object',
              properties: {
                encoding: { type: 'string' },
                filename: { type: 'string' },
                limit: { type: 'boolean' },
                mimetype: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
        };
        Body: {
          format: MultipartValue<'json'>;
          language: MultipartValue<string>;
          file: MultipartFile;
        };
      }>,
      reply
    ) => {
      function translationImportFileKey(args: {
        workspaceId: number;
        format: 'json';
        language: string;
        translationImportAttemptId: number;
      }): string {
        return [
          'workspace',
          args.workspaceId,
          'translation',
          'import',
          `${args.translationImportAttemptId}.${args.language}.${args.format}`,
        ].join('/');
      }

      const { workspaceId } = request.params;
      const format = request.body.format.value;
      const language = request.body.language.value;
      const file = request.body.file;
      const buffer = await file.toBuffer();

      switch (format) {
        case 'json':
          /**
           * @todo
           *
           * Move this to translationsImportBehavior.triggerFromJsonFile
           */
          if (file.mimetype !== 'application/json') {
            return reply.status(400).send({
              message: 'Invalid file format',
            });
          }

          return go(
            await fastify.fileStorage.uploadFile(
              FileStorageLocation.Internal,
              translationImportFileKey({
                workspaceId,
                format,
                language,
                /**
                 * @todo
                 *
                 * 1. Create a new TranslationsImportAttempt
                 * 2. Put object to file storage with key
                 * 3. Patch TranslationsImportAttempt with http url of the stored file
                 */
                translationImportAttemptId: 1,
              }),
              buffer
            ),
            Either.mapOrElse(
              /**
               * @todo
               *
               * Return the created TranslationsImportAttempt
               */
              () => reply.status(201).send(),
              () =>
                reply.status(500).send({
                  statusCode: 500,
                  message: 'Internal Server Error',
                })
            )
          );
        default:
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid format',
          });
      }
    }
  );
}
