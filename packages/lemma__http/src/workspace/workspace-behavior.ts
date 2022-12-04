import { Account, Workspace } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import { OffsetPagination } from '~/lib/offset-pagination';

type CreateWorkspaceArgs = {
  slug: string;
  displayName?: string;
};

declare module 'fastify' {
  interface FastifyInstance {
    workspaceBehavior: {
      getWorkspace(workspaceId: Workspace['id']): Promise<Workspace | null>;
      getWorkspacesPage(accountId: Account['id'], options: OffsetPagination.RequestOptions): Promise<Workspace[]>;
      getWorkspacesNumPages(accountId: Account['id']): Promise<number>;
      findWorkspaceBySlug(slug: Workspace['slug']): Promise<Workspace | null>;
      createWorkspace(accountId: Account['id'], args: CreateWorkspaceArgs): Promise<Workspace>;
    };
  }
}

export async function workspaceBehavior(fastify: FastifyInstance) {
  async function getWorkspace(workspaceId: Workspace['id']): Promise<Workspace | null> {
    return fastify.rdb.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        profile: true,
      },
    });
  }

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

  async function createWorkspace(accountId: Account['id'], args: CreateWorkspaceArgs): Promise<Workspace> {
    return fastify.rdb.workspace.create({
      data: {
        slug: args.slug,
        profile: {
          create: {
            displayName: args.displayName ?? args.slug,
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
    getWorkspace,
    getWorkspacesPage,
    getWorkspacesNumPages,
    findWorkspaceBySlug,
    createWorkspace,
  });
}
