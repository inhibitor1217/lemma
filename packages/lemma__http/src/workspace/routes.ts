import { Workspace } from '@lemma/prisma-client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { OffsetPagination } from '~/lib/offset-pagination';
import sessionGuard from '~/lib/session-guard';
import { workspaceBehavior } from './workspace-behavior';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(sessionGuard);
  fastify.register(fp(workspaceBehavior));

  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            ...OffsetPagination.requestSchemaQuerystringProperties,
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: OffsetPagination.RequestQuerystring;
      }>,
      reply
    ) => {
      const { accountId } = request.session;

      const options = OffsetPagination.qsToOptions(request.query);
      const items = await fastify.workspaceBehavior.getWorkspacesPage(accountId, options);
      const pages = await fastify.workspaceBehavior.getWorkspacesNumPages(accountId);

      const workspaces: OffsetPagination.Reply<Workspace> = {
        items,
        pages,
        page: options.page,
      };

      return { workspaces };
    }
  );

  fastify.post('/', async (request, reply) => {
    return reply.status(501).send({ statusCode: 501, message: 'Not Implemented' });
  });
}
