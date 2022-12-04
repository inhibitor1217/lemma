import { Workspace } from '@lemma/prisma-client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { OffsetPagination } from '~/lib/offset-pagination';
import sessionGuard from '~/lib/session-guard';
import { workspaceBehavior } from '../workspace-behavior';

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

      return reply.status(200).send({ workspaces });
    }
  );

  fastify.get(
    '/search',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              minLength: 1,
              maxLength: 32,
              pattern: '^[a-z0-9-_/]+$',
            },
          },
          required: ['slug'],
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          slug: string;
        };
      }>,
      reply
    ) => {
      const { slug } = request.query;
      const workspace = await fastify.workspaceBehavior.findWorkspaceBySlug(slug);

      if (!workspace) {
        return reply.status(404).send({ statusCode: 404, message: 'Not Found' });
      }

      return reply.status(200).send({ workspace });
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              minLength: 1,
              maxLength: 32,
              pattern: '^[a-z0-9-_/]+$',
            },
            displayName: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
            },
          },
          required: ['slug'],
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: {
          slug: string;
          displayName?: string;
        };
      }>,
      reply
    ) => {
      const { accountId } = request.session;
      const { slug, displayName } = request.body;

      const duplicate = await fastify.workspaceBehavior.findWorkspaceBySlug(slug);

      if (duplicate) {
        return reply.status(400).send({
          statusCode: 400,
          message: `Workspace with slug '${slug}' already exists`,
        });
      }

      const workspace = await fastify.workspaceBehavior.createWorkspace(accountId, { slug, displayName });

      return reply.status(201).send({ workspace });
    }
  );
}
