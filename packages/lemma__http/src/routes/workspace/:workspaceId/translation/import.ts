import multipart, { MultipartFile, MultipartValue } from '@fastify/multipart';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { language } from '~/lib/translation';

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
      const { workspaceId } = request.params;
      const format = request.body.format.value;
      const language = request.body.language.value;
      const file = request.body.file;

      fastify.log.debug({
        format,
        language,
        filename: file.filename,
        mimetype: file.mimetype,
      });

      switch (format) {
        case 'json':
          if (file.mimetype !== 'application/json') {
            return reply.status(400).send({
              message: 'Invalid file format',
            });
          }

          return reply.status(200).send();
        default:
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid format',
          });
      }
    }
  );
}
