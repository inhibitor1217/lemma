import { FastifyInstance, FastifyRequest } from 'fastify';
import { key, language } from '~/translation/lib';

export default async function routes(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: 'translationId',
    type: 'string',
  });

  fastify.addSchema({
    $id: 'translationKey',
    type: 'string',
    minLength: 1,
    maxLength: 255,
    pattern: key.regexpStr,
  });

  fastify.addSchema({
    $id: 'translationTranslations',
    type: 'object',
    patternProperties: {
      [language.code.regexpStr]: {
        type: 'string',
      },
    },
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
      const { workspaceId, translationId } = request.params;

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
        body: {
          type: 'object',
          properties: {
            key: fastify.getSchema('translationKey'),
            translations: fastify.getSchema('translationTranslations'),
          },
          required: ['key'],
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
        };
        Body: {
          key: string;
          translations?: Record<string, string>;
        };
      }>,
      reply
    ) => {
      const { workspaceId } = request.params;
      const { key, translations } = request.body;

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
        body: {
          type: 'object',
          properties: {
            key: fastify.getSchema('translationKey'),
            translations: fastify.getSchema('translationTranslations'),
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
          translationId: string;
        };
        Body: {
          key?: string;
          translations?: Record<string, string>;
        };
      }>,
      reply
    ) => {
      const { workspaceId, translationId } = request.params;
      const { key, translations } = request.body;

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
      const { workspaceId, translationId } = request.params;

      return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
    }
  );
}