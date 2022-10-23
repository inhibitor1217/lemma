import { Account, Workspace } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import { OffsetPagination } from '~/lib/offset-pagination';

declare module 'fastify' {
  interface FastifyInstance {
    workspaceBehavior: {
      getWorkspacesPage(accountId: Account['id'], options: OffsetPagination.RequestOptions): Promise<Workspace[]>;
      getWorkspacesNumPages(accountId: Account['id']): Promise<number>;
      findWorkspaceBySlug(slug: Workspace['slug']): Promise<Workspace | null>;
      createWorkspace(accountId: Account['id'], args: Pick<Workspace, 'slug'>): Promise<Workspace>;
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
      orderBy: {
        createdAt: 'desc',
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

  async function findWorkspaceBySlug(slug: Workspace['slug']): Promise<Workspace | null> {
    return fastify.rdb.workspace.findUnique({
      where: {
        slug,
      },
    });
  }

  async function createWorkspace(accountId: Account['id'], args: Pick<Workspace, 'slug'>): Promise<Workspace> {
    return fastify.rdb.workspace.create({
      data: {
        slug: args.slug,
        profile: {
          create: {
            displayName: args.slug,
          },
        },
        members: {
          create: {
            accountId,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  fastify.decorate('workspaceBehavior', {
    getWorkspacesPage,
    getWorkspacesNumPages,
    findWorkspaceBySlug,
    createWorkspace,
  });
}
