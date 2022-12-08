import Fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { routes as accountRoutes } from '~/account';
import auth, { routes as authRoutes } from '~/auth';
import db from '~/db';
import env from '~/env';
import jwt from '~/lib/jwt-plugin';
import sessionGuard from '~/lib/session-guard';
import ping from '~/ping';
import security from '~/security';
import { routes as translationRoutes } from '~/translation';
import web from '~/web';
import { routes as workspaceRoutes, workspaceGuard } from '~/workspace';

const fastify = Fastify({ logger: true });

fastify.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  reply.statusCode = error.statusCode ?? 500;
  fastify.log.error(error);

  if (error.statusCode === 400) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  return {
    statusCode: error.statusCode ?? 500,
    message: 'Internal Server Error',
  };
});

fastify.register(env);
fastify.register(security);
fastify.register(db);

fastify.register(auth);
fastify.register(jwt);
fastify.register(web);

fastify.register(accountRoutes, { prefix: '/account' });
fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(ping, { prefix: '/ping' });
fastify.register(workspaceRoutes.workspaces, { prefix: '/workspace' });
fastify.register(
  async (fastify: FastifyInstance) => {
    fastify.register(sessionGuard);
    fastify.register(workspaceGuard);

    fastify.addSchema({
      $id: 'workspaceId',
      type: 'number',
    });

    fastify.register(workspaceRoutes.workspace);
    fastify.register(translationRoutes.translations, { prefix: '/translation' });
    fastify.register(translationRoutes.translation, { prefix: '/translation' });
  },
  { prefix: '/workspace/:workspaceId' }
);

export default fastify;
