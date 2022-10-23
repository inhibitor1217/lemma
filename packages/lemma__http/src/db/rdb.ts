import { PrismaClient } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    rdb: typeof rdbClient;
  }
}

const rdbClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

async function queryLogger(fastify: FastifyInstance) {
  fastify.rdb.$on('query', (e) => {
    fastify.log.debug(`[RDB:query] ${e.query}`);
    fastify.log.debug(`[RDB:params] ${e.params}`);
    fastify.log.debug(`[RDB:duration] ${e.duration}ms`);
  });
}

async function rdb(fastify: FastifyInstance) {
  fastify.decorate('rdb', rdbClient);
  fastify.register(queryLogger);
}

export default fp(rdb);
