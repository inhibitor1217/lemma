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
  async function getWorkspacesPage(accountId: Account['id'], options: OffsetPagination.RequestOptions) {
    return [];
  }

  async function getWorkspacesNumPages(accountId: Account['id']) {
    return OffsetPagination.toNumPages(0);
  }

  fastify.decorate('workspaceBehavior', {
    getWorkspacesPage,
    getWorkspacesNumPages,
  });
}
