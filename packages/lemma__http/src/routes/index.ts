import { FastifyInstance } from 'fastify';
import account from './account';
import auth from './auth';
import ping from './ping';
import workspace from './workspace';

async function routes(fastify: FastifyInstance) {
  fastify.register(account, { prefix: '/account' });
  fastify.register(auth, { prefix: '/auth' });
  fastify.register(ping, { prefix: '/ping' });
  fastify.register(workspace, { prefix: '/workspace' });
}

export default routes;
