import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import auth from '~/auth';
import db from '~/db';
import env from '~/env';
import { jwtPlugin } from '~/lib/jwt';
import security from '~/security';
import web from '~/web';

import routes from '~/routes';

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

fastify.register(routes);

export default fastify;
