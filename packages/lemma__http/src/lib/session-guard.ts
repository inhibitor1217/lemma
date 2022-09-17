import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function sessionGuard(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    if (!request.session.accountId) {
      return reply.status(401).send({ statusCode: 401, message: 'Unauthorized' });
    }

    request.session.touch();
  });
}

export default fp(sessionGuard);
