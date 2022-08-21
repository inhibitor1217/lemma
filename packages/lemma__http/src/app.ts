import Fastify, {
  FastifyError,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import db from '~/db';
import env from '~/env';
import ping from '~/ping';

const fastify = Fastify({ logger: true });

fastify.setErrorHandler(async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.statusCode = error.statusCode ?? 500;
  fastify.log.error(error);

  return {
    statusCode: 500,
    message: 'Internal Server Error',
  };
});

fastify.register(env);
fastify.register(db);

fastify.register(ping, { prefix: '/ping' });

export default fastify;
