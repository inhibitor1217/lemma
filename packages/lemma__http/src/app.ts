import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import auth from '~/auth';
import db from '~/db';
import cors from '~/lib-plugins/cors';
import env from '~/lib-plugins/env';
import jwt from '~/lib-plugins/jwt';
import web from '~/lib-plugins/web';

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
fastify.register(jwt);
fastify.register(web);
fastify.register(cors);

fastify.register(db);

fastify.register(auth);

fastify.register(routes);

export default fastify;
