import { FastifyInstance } from 'fastify';

export default async function routes(fastify: FastifyInstance) {
  fastify.get('/google', async (request, reply) => {
    reply.statusCode = 501;
    reply.send('Not implemented');
  });

  fastify.get('/google/redirect', async (request, reply) => {
    reply.statusCode = 501;
    reply.send('Not implemented');
  });
}
