import { Account, Workspace } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import { OffsetPagination } from '~/lib/offset-pagination';

declare module 'fastify' {
  interface FastifyInstance {
    workspaceBehavior: {
      getWorkspacesPage(accountId: Account['id'], options: OffsetPagination.RequestOptions): Promise<Workspace[]>;
      getWorkspacesNumPages(accountId: Account['id']): Promise<number>;
    };
  }
}

export async function workspaceBehavior(fastify: FastifyInstance) {
  async function getWorkspacesPage(accountId: Account['id'], options: OffsetPagination.RequestOptions): Promise<Workspace[]> {
    return fastify.rdb.workspace.findMany({
      where: {
        members: {
          some: {
            accountId,
          },
        },
      },
      include: {
        profile: true,
      },
      ...OffsetPagination.optionsToRdbQuery(options),
    });
  }

  async function getWorkspacesNumPages(accountId: Account['id']): Promise<number> {
    return fastify.rdb.workspace
      .count({
        where: {
          members: {
            some: {
              accountId,
            },
          },
        },
      })
      .then(OffsetPagination.toNumPages);
  }

  fastify.decorate('workspaceBehavior', {
    getWorkspacesPage,
    getWorkspacesNumPages,
  });
}
