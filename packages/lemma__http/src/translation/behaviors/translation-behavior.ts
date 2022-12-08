import { Either, go, Option } from '@lemma/fx';
import { Translation } from '@lemma/mongo-client';
import { FastifyInstance } from 'fastify';
import { MongoDBErrorCode } from '~/lib/mongodb';
import { DuplicateTranslationKeyException, TranslationNotFoundException } from './translation-behavior.exception';

type CreateTranslationArgs = {
  workspaceId: number;
  key: string;
  translations: Record<string, string>;
};

type CreateTranslationErrors = DuplicateTranslationKeyException;

type UpdateTranslationArgs = {
  workspaceId: number;
  translationId: string;
  translation: {
    key?: string;
    translations?: Record<string, string>;
  };
};

type UpdateTranslationErrors = DuplicateTranslationKeyException | TranslationNotFoundException;

type DeleteTranslationErrors = TranslationNotFoundException;

declare module 'fastify' {
  interface FastifyInstance {
    translationBehavior: {
      getTranslation(workspaceId: number, translationId: string): Promise<Option<Translation>>;
      createTranslation(args: CreateTranslationArgs): Promise<Either<Translation, CreateTranslationErrors>>;
      updateTranslation(args: UpdateTranslationArgs): Promise<Either<Translation, UpdateTranslationErrors>>;
      deleteTranslation(workspaceId: number, translationId: string): Promise<Either<void, DeleteTranslationErrors>>;
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

  async function createTranslation(args: CreateTranslationArgs): Promise<Either<Translation, CreateTranslationErrors>> {
    return fastify.mongodb.translation
      .create({
        workspaceId: args.workspaceId,
        key: args.key,
        translations: args.translations,
      })
      .then(Either.ok)
      .catch((error) => {
        if (error.code === MongoDBErrorCode.DUPLICATE_KEY) {
          return Either.error(new DuplicateTranslationKeyException(args.key));
        }

        throw error;
      });
  }

  async function updateTranslation(args: UpdateTranslationArgs): Promise<Either<Translation, UpdateTranslationErrors>> {
    throw new Error('Not implemented');
  }

  async function deleteTranslation(workspaceId: number, translationId: string): Promise<Either<void, DeleteTranslationErrors>> {
    throw new Error('Not implemented');
  }

  fastify.decorate('translationBehavior', {
    getTranslation,
    createTranslation,
    updateTranslation,
    deleteTranslation,
  });
}
