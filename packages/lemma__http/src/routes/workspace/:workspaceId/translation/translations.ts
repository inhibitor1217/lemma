import { FastifyInstance, FastifyRequest } from 'fastify';

export default async function translations(fastify: FastifyInstance) {
  /**
   * @api {get} /workspace/:workspaceId/translation Get translations
   * @description Get all translations
   *
   * @todo
   * Get all translations of a workspace,
   * with cursor pagination.
   */
  fastify.get(
    '/',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
        };
      }>,
      reply
    ) => {
      return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
    }
  );

  /**
   * @api {get} /workspace/:workspaceId/translation/search
   * @description Search translations
   *
   * Search for translations in a workspace.
   *
   * @todo
   *  - `key`: Search for translations with a specific key.
   *  - `keyPrefix`: Search for translations with keys starting with a specific prefix.
   *  - `phrase`: Search for translations which contain a specific phrase.
   */
  fastify.get(
    '/search',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
        };
      }>,
      reply
    ) => {
      return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
    }
  );
}
