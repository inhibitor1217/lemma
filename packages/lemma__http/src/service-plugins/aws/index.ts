import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import lambda from './lambda';
import s3 from './s3';

async function aws(fastify: FastifyInstance) {
  fastify.register(lambda);
  fastify.register(s3);
}

export default fp(aws);
