import { go, Option } from '@lemma/fx';
import { Translation } from '@lemma/mongo-client';
import { FastifyInstance } from 'fastify';
import { MongoDBErrorCode } from '~/lib/mongodb';
import { DuplicateTranslationKeyException } from './translation-behavior.exception';

type CreateTranslationArgs = {
  workspaceId: number;
  key: string;
  translations: Record<string, string>;
};

declare module 'fastify' {
  interface FastifyInstance {
    translationBehavior: {
      getTranslation(workspaceId: number, translationId: string): Promise<Option<Translation>>;
      createTranslation(args: CreateTranslationArgs): Promise<Translation>;
    };
  }
}

export async function translationBehavior(fastify: FastifyInstance) {
  async function getTranslation(workspaceId: number, translationId: string): Promise<Option<Translation>> {
    return go(
      await fastify.mongodb.translation.findById(translationId),
      Option.filter((translation) => translation.workspaceId === workspaceId)
    );
  }

  async function createTranslation(args: CreateTranslationArgs): Promise<Translation> {
    return fastify.mongodb.translation
      .create({
        workspaceId: args.workspaceId,
        key: args.key,
        translations: args.translations,
      })
      .catch((error) => {
        if (error.code === MongoDBErrorCode.DUPLICATE_KEY) {
          throw new DuplicateTranslationKeyException(args.key);
        }

        throw error;
      });
  }

  fastify.decorate('translationBehavior', {
    getTranslation,
    createTranslation,
  });
}
