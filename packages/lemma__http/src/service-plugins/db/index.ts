import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongodb from './mongodb';
import rdb from './rdb';
import redis from './redis';

async function db(fastify: FastifyInstance) {
  fastify.register(mongodb);
  fastify.register(rdb);
  fastify.register(redis);
}

export default fp(db);
