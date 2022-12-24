import multipart, { MultipartFile, MultipartValue } from '@fastify/multipart';
import { Either, go, Task } from '@lemma/fx';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { translationsImportBehavior } from '~/behaviors/translation';
import { language } from '~/lib/translation';

export default async function _import(fastify: FastifyInstance) {
  fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      files: 1,
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });

  fastify.register(fp(translationsImportBehavior));

  /**
   * @api {post} /workspace/:workspaceId/translation/import/file
   * @description Import translations from a file
   *
   * Adds translations to the workspace from a file.
   * Supports JSON format.
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
          required: ['format', 'language', 'file', 'requestKey'],
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
            requestKey: {
              type: 'object',
              properties: {
                value: { type: 'string', pattern: '^[0-9a-f]{24}$' },
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
          requestKey: MultipartValue<string>;
          file: MultipartFile;
        };
      }>,
      reply
    ) => {
      const { workspaceId } = request.params;
      const format = request.body.format.value;
      const language = request.body.language.value;
      const requestKey = request.body.requestKey.value;
      const file = request.body.file;
      const buffer = await file.toBuffer();

      switch (format) {
        case 'json':
          return go(
            await Task.run(
              fastify.translationsImportBehavior.triggerImportFromJsonFile({
                requestKey,
                workspaceId,
                memberId: request.memberId,
                language,
                mimetype: file.mimetype,
                buffer,
              })
            ),
            Either.mapOrElse(
              ({ translationsImportAttempt }) =>
                reply.status(201).send({
                  translationsImportAttempt,
                }),
              (error) => {
                switch (error.type) {
                  case 'TranslationsImportBehavior.InvalidFileMIMETypeException':
                    return reply.status(400).send({ statusCode: 400, message: 'Invalid file MIME type' });
                  case 'TranslationsImportBehavior.TranslationsImportException':
                    throw error;
                }
              }
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
