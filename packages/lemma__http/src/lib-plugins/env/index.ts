import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Env, loadEnv, Stage } from '~/lib/env';

declare module 'fastify' {
  interface FastifyInstance {
    env: Env;
  }
}

async function env(fastify: FastifyInstance) {
  fastify.decorate('env', await loadEnv());
  fastify.log.level = fastify.env.stage.is(Stage.Dev) ? 'debug' : 'info';
}

export default fp(env);
