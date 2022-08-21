import { FastifyInstance } from 'fastify';

export default async (
  fastify: FastifyInstance,
) => {
  fastify.get('/ping', async () => '@lemma/http server is alive!');
};
