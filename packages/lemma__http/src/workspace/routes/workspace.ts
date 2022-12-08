import { go, Option } from '@lemma/fx';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { workspaceBehavior } from '~/workspace/behaviors';

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

      return go(
        workspace,
        Option.reduce(
          (workspace) => reply.status(200).send({ workspace }),
          () => reply.status(404).send({ statusCode: 404, message: 'Not Found' })
        )
      );
    }
  );
}
