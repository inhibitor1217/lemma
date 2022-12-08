import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    translationBehavior: {};
  }
}

export async function translationBehavior(fastify: FastifyInstance) {
  fastify.decorate('translationBehavior', {});
}
