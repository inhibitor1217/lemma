import { FastifyInstance } from 'fastify';

export default async function me(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    const account = await fastify.rdb.account.findUnique({
      where: { id: request.session.accountId },
    });

    if (!account) {
      return reply.status(404).send({ statusCode: 404, message: 'Not Found' });
    }

    return { account };
  });

  fastify.delete('/logout', async (request, reply) => {
    await request.signOut();
    await reply.signOut();

    return reply.status(204).send();
  });
}
