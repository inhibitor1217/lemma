import { PrismaClient } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    rdb: PrismaClient
  }
}

const rdbClient = new PrismaClient();

async function rdb(fastify: FastifyInstance) {
  fastify.decorate('rdb', rdbClient);
}

export default fp(rdb);
