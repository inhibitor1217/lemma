import { FastifyInstance } from 'fastify';
import { sessionGuard } from '~/lib/auth';
import me from './me';

export default async function account(fastify: FastifyInstance) {
  fastify.register(sessionGuard);

  fastify.register(me, { prefix: '/me' });
}
