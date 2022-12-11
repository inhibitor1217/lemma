import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    memberId: number;
  }
}

async function workspaceGuard(fastify: FastifyInstance) {
  fastify.addHook(
    'preHandler',
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
        };
      }>,
      reply
    ) => {
      if (!request.session.accountId) {
        return reply.status(401).send({ statusCode: 401, message: 'Unauthorized' });
      }

      const member = await fastify.rdb.member.findUnique({
        where: {
          accountId_workspaceId: {
            accountId: request.session.accountId,
            workspaceId: request.params.workspaceId,
          },
        },
      });

      if (!member) {
        return reply.status(403).send({ statusCode: 403, message: 'Forbidden' });
      }

      request.memberId = member.id;
    }
  );
}

export default fp(workspaceGuard);
