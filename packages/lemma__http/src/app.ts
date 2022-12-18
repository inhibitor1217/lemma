import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import auth from '~/lib-plugins/auth';
import cors from '~/lib-plugins/cors';
import env from '~/lib-plugins/env';
import jwt from '~/lib-plugins/jwt';
import web from '~/lib-plugins/web';
import aws from '~/service-plugins/aws';
import db from '~/service-plugins/db';
import fileStorage from '~/service-plugins/file-storage';
import fn from '~/service-plugins/fn';
import routes from '~/routes';

const fastify = Fastify({ logger: true });

fastify.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  reply.statusCode = error.statusCode ?? 500;

  if (!error.statusCode || error.statusCode >= 500) {
    fastify.log.error(error);
  }

  if (error.statusCode === 400) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  if (error.statusCode === 406) {
    return {
      statusCode: error.statusCode,
      message: 'Not Acceptable',
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

fastify.register(aws);
fastify.register(db);

fastify.register(auth);
fastify.register(fileStorage);
fastify.register(fn);

fastify.register(routes);

export default fastify;
