import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import rdb from './rdb';
import redis from './redis';

async function db(fastify: FastifyInstance) {
  fastify.register(rdb);
  fastify.register(redis);
}

export default fp(db);
