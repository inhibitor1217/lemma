import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import s3 from './s3';

async function aws(fastify: FastifyInstance) {
  fastify.register(s3);
}

export default fp(aws);
