import { FastifyInstance } from 'fastify';
import sessionGuard from '~/guards/session-guard';
import workspaces from './workspaces';
import workspaceId from './:workspaceId';

export default async function workspace(fastify: FastifyInstance) {
  fastify.register(sessionGuard);

  fastify.register(workspaces);
  fastify.register(workspaceId, { prefix: '/:workspaceId' });
}
