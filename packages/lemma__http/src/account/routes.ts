import { FastifyInstance } from 'fastify';

export default async function routes(fastify: FastifyInstance) {
  fastify.get('/me', async (request, reply) => {

  });
}
