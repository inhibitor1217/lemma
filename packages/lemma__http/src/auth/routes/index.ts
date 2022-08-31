import { FastifyInstance } from 'fastify';
import google from './google';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(google, { prefix: '/google' });
}
