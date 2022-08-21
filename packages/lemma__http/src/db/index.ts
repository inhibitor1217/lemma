import { PrismaClient } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient
  }
}

const client = new PrismaClient();

async function db(fastify: FastifyInstance) {
  fastify.db = client;
}

export default fp(db);
