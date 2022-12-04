import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { workspaceBehavior } from '../workspace-behavior';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(fp(workspaceBehavior));

  fastify.get(
    '/',
    {
      schema: {
        params: {
          workspaceId: fastify.getSchema('workspaceId'),
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: {
          workspaceId: number;
        };
      }>,
      reply
    ) => {
      const { workspaceId } = request.params;
      const workspace = await fastify.workspaceBehavior.getWorkspace(workspaceId);

      if (!workspace) {
        return reply.status(404).send({ statusCode: 404, message: 'Not Found' });
      }

      return reply.status(200).send({ workspace });
    }
  );
}
