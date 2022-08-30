import { FastifyInstance } from 'fastify';
import sessionGuard from '~/lib/session-guard';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(sessionGuard);

  fastify.get('/me', async (request, reply) => {
    const account = await fastify.rdb.account.findUnique({
      where: { id: request.session.accountId },
    });

    if (!account) {
      return reply
        .status(404)
        .send({ statusCode: 404, message: 'Not Found' });
    }

    return { account };
  });

  fastify.delete('/logout', async (request, reply) => {
    return reply
      .status(501)
      .send({ statusCode: 501, message: 'Not Implemented' });
  });
}
