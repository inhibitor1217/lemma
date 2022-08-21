import { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    return `@lemma/http ${fastify.env.stage} server is alive!`;
  });
};
