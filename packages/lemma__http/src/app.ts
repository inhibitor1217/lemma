import Fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { routes as accountRoutes } from '~/account';
import auth, { routes as authRoutes } from '~/auth';
import db from '~/db';
import env from '~/env';
import { sessionGuard } from '~/lib/auth';
import { jwtPlugin } from '~/lib/jwt';
import ping from '~/ping';
import security from '~/security';
import * as translation from '~/translation';
import web from '~/web';
import * as workspace from '~/workspace';

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
fastify.register(jwtPlugin);
fastify.register(web);

fastify.register(accountRoutes, { prefix: '/account' });
fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(ping, { prefix: '/ping' });
fastify.register(workspace.routes.workspaces, { prefix: '/workspace' });
fastify.register(
  async (fastify: FastifyInstance) => {
    fastify.register(sessionGuard);
    fastify.register(workspace.lib.workspaceGuard);

    fastify.addSchema({
      $id: 'workspaceId',
      type: 'number',
    });

    fastify.register(workspace.routes.workspace);

    fastify.register(translation.routes.translations, { prefix: '/translation' });
    fastify.register(translation.routes.translation, { prefix: '/translation' });
  },
  { prefix: '/workspace/:workspaceId' }
);

export default fastify;
