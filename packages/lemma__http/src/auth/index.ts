import { FastifyInstance } from 'fastify';

async function auth(fastify: FastifyInstance) {

}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/google', async (request, reply) => {
    reply.statusCode = 501;
    reply.send('Not implemented');
  });

  fastify.get('/google/redirect', async (request, reply) => {
    reply.statusCode = 501;
    reply.send('Not implemented');
  });
}

export default auth;
