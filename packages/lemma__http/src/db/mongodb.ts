import { MongoClient } from '@lemma/mongo-client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/env';

declare module 'fastify' {
  interface FastifyInstance {
    mongodb: MongoClient;
  }
}

async function mongodb(fastify: FastifyInstance) {
  const client = new MongoClient({
    host: fastify.env.mongodb.host,
    port: fastify.env.mongodb.port,
    database: fastify.env.mongodb.database,
    username: fastify.env.mongodb.username,
    password: fastify.env.mongodb.password,

    log: {
      logger: fastify.log,
      level: fastify.env.stage.is(Stage.Dev) ? 'debug' : 'info',
    },
  });

  fastify.decorate('mongodb', client);
}

export default fp(mongodb);
