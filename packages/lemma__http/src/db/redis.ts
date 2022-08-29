import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis
  }
}

async function redis(fastify: FastifyInstance) {
  fastify.decorate('redis', new Redis({
    host: fastify.env.redis.host,
    port: fastify.env.redis.port,
    username: fastify.env.redis.username,
    password: fastify.env.redis.password,
  }));
}

export default fp(redis);
