import { FastifyInstance } from 'fastify';
import sessionGuard from '~/guards/session-guard';
import me from './me';

export default async function account(fastify: FastifyInstance) {
  fastify.register(sessionGuard);

  fastify.register(me, { prefix: '/me' });
}
