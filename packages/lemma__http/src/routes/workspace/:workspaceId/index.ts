import { FastifyInstance } from 'fastify';
import { workspaceGuard } from '~/workspace/lib';
import translation from './translation';
import workspace from './workspace';

export default async function workspaceId(fastify: FastifyInstance) {
  fastify.register(workspaceGuard);

  fastify.addSchema({
    $id: 'workspaceId',
    type: 'number',
  });

  fastify.register(workspace);
  fastify.register(translation, { prefix: '/translation' });
}
