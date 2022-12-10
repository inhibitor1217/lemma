import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

async function redis(fastify: FastifyInstance) {
  const client = new Redis({
    host: fastify.env.redis.host,
    port: fastify.env.redis.port,
    username: fastify.env.redis.username,
    password: fastify.env.redis.password,
  });

  client.on('error', (error) => {
    fastify.log.error(error);
  });

  fastify.decorate('redis', client);
}

export default fp(redis);
