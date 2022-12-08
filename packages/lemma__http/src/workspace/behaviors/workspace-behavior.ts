import { Option } from '@lemma/fx';
import { Workspace } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import { OffsetPagination } from '~/lib/pagination';

type CreateWorkspaceArgs = {
  slug: string;
  displayName?: string;
};

declare module 'fastify' {
  interface FastifyInstance {
    workspaceBehavior: {
      getWorkspace(workspaceId: number): Promise<Option<Workspace>>;
      getWorkspacesPage(accountId: number, options: OffsetPagination.RequestOptions): Promise<Workspace[]>;
      getWorkspacesNumPages(accountId: number): Promise<number>;
      findWorkspaceBySlug(slug: string): Promise<Option<Workspace>>;
      createWorkspace(accountId: number, args: CreateWorkspaceArgs): Promise<Workspace>;
    };
  }
}

export async function workspaceBehavior(fastify: FastifyInstance) {
  async function getWorkspace(workspaceId: number): Promise<Option<Workspace>> {
    return fastify.rdb.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        profile: true,
      },
    });
  }

  async function getWorkspacesPage(accountId: number, options: OffsetPagination.RequestOptions): Promise<Workspace[]> {
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

  async function getWorkspacesNumPages(accountId: number): Promise<number> {
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

  async function findWorkspaceBySlug(slug: string): Promise<Option<Workspace>> {
    return fastify.rdb.workspace.findUnique({
      where: {
        slug,
      },
    });
  }

  async function createWorkspace(accountId: number, args: CreateWorkspaceArgs): Promise<Workspace> {
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
