import { FastifyInstance, FastifyRequest } from 'fastify';

export default async function routes(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: 'translationId',
    type: 'string',
  });

  /**
   * @api {get} /workspace/:workspaceId/translation/:translationId
   * @description Get a translation by id
   *
   * @todo
   * Get a translation by id.
   */
  fastify.get(
    '/:translationId',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
          translationId: fastify.getSchema('translationId'),
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
          translationId: string;
        };
      }>,
      reply
    ) => {
      return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
    }
  );

  /**
   * @api {post} /workspace/:workspaceId/translation
   * @description Create a translation
   *
   * @todo
   * Add a new translation to a workspace.
   */
  fastify.post(
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
   * @api {patch} /workspace/:workspaceId/translation/:translationId
   * @description Update a translation
   *
   * @todo
   * Update a translation.
   */
  fastify.patch(
    '/:translationId',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
          translationId: fastify.getSchema('translationId'),
        },
      },
      // @todo
      // body: { ... },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
          translationId: string;
        };
      }>,
      reply
    ) => {
      return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
    }
  );

  /**
   * @api {delete} /workspace/:workspaceId/translation/:translationId
   * @description Delete a translation
   *
   * @todo
   * Delete a translation.
   */
  fastify.delete(
    '/:translationId',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
          translationId: fastify.getSchema('translationId'),
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
          translationId: string;
        };
      }>,
      reply
    ) => {
      return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
    }
  );
}
