import { FastifyInstance } from 'fastify';

export default async function ping(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return `@lemma/http ${fastify.env.stage} server is alive!`;
  });
}
