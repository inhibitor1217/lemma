import { FastifyInstance } from 'fastify';
import loadEnv from '~/lib/env';

export default async (
  fastify: FastifyInstance,
) => {
  fastify.get('/', async () => {
    const env = await loadEnv();
    return `@lemma/http ${env.stage} server is alive!`;
  });
};
