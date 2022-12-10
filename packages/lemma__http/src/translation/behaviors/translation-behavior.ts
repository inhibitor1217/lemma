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
    return fastify.mongodb.translation
      .findOneAndUpdate(
        {
          _id: args.translationId,
          workspaceId: args.workspaceId,
        },
        {
          $set: {
            key: args.translation.key,
            translations: args.translation.translations,
          },
        },
        {
          new: true,
        }
      )
      .then((translation) =>
        translation ? Either.ok(translation) : Either.error(new TranslationNotFoundException(args.translationId))
      )
      .catch((error) => {
        if (error.code === MongoDBErrorCode.DUPLICATE_KEY) {
          if (!args.translation.key) {
            throw new TypeError('args.translation.key should have existed, but it was undefined');
          }

          return Either.error(new DuplicateTranslationKeyException(args.translation.key));
        }

        throw error;
      });
  }

  async function deleteTranslation(workspaceId: number, translationId: string): Promise<Either<void, DeleteTranslationErrors>> {
    return fastify.mongodb.translation
      .findOneAndDelete({
        _id: translationId,
        workspaceId,
      })
      .then((translation) =>
        translation ? Either.ok(undefined) : Either.error(new TranslationNotFoundException(translationId))
      );
  }

  fastify.decorate('translationBehavior', {
    getTranslation,
    createTranslation,
    updateTranslation,
    deleteTranslation,
  });
}
