import { Either, go, Option } from '@lemma/fx';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { DuplicateTranslationKeyException, translationBehavior, TranslationNotFoundException } from '~/behaviors/translation';
import { MongoDBEntityView } from '~/lib/mongodb';
import { key, language } from '~/lib/translation';

export default async function translation(fastify: FastifyInstance) {
  fastify.register(fp(translationBehavior));

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

      return go(
        await fastify.translationBehavior.getTranslation(workspaceId, translationId),
        Option.map((translation) => translation.toObject({ flattenMaps: true })),
        Option.map(MongoDBEntityView.from),
        Option.reduce(
          (translation) => reply.status(200).send({ translation }),
          () => reply.status(404).send({ statusCode: 404, message: 'Not Found' })
        )
      );
    }
  );

  /**
   * @api {post} /workspace/:workspaceId/translation
   * @description Create a translation
   *
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
      const { key, translations = {} } = request.body;

      return go(
        await fastify.translationBehavior.createTranslation({
          workspaceId,
          key,
          translations,
        }),
        Either.map((translation) => translation.toObject({ flattenMaps: true })),
        Either.map(MongoDBEntityView.from),
        Either.reduce(
          (translation) => reply.status(201).send({ translation }),
          (error) => reply.status(400).send({ statusCode: 400, message: error.toString() })
        )
      );
    }
  );

  /**
   * @api {patch} /workspace/:workspaceId/translation/:translationId
   * @description Update a translation
   *
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

      return go(
        await fastify.translationBehavior.updateTranslation({
          workspaceId,
          translationId,
          translation: {
            key,
            translations,
          },
        }),
        Either.map((translation) => translation.toObject({ flattenMaps: true })),
        Either.map(MongoDBEntityView.from),
        Either.reduce(
          (translation) => reply.status(200).send({ translation }),
          (error) => {
            switch (error.type) {
              case 'TranslationBehavior.DuplicateTranslationKeyException':
                return reply.status(400).send({ statusCode: 400, message: error.toString() });
              case 'TranslationBehavior.TranslationNotFoundException':
                return reply.status(404).send({ statusCode: 404, message: error.toString() });
            }
          }
        )
      );
    }
  );

  /**
   * @api {delete} /workspace/:workspaceId/translation/:translationId
   * @description Delete a translation
   *
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

      return go(
        await fastify.translationBehavior.deleteTranslation(workspaceId, translationId),
        Either.reduce(
          () => reply.status(204).send(),
          (error) => reply.status(404).send({ statusCode: 404, message: error.toString() })
        )
      );
    }
  );
}
