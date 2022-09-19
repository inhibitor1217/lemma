import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { routes as accountRoutes } from '~/account';
import auth, { routes as authRoutes } from '~/auth';
import db from '~/db';
import env from '~/env';
import jwt from '~/lib/jwt';
import ping from '~/ping';
import security from '~/security';
import web from '~/web';

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

export default fastify;
