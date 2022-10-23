import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Env } from './env';
import Stage from './stage';

declare module 'fastify' {
  interface FastifyInstance {
    env: Env;
  }
}

const loadEnv = (() => {
  const loadFromFile = (): Promise<Env> =>
    import('dotenv').then((dotenv) => {
      dotenv.config({ path: '.env.local' });

      return {
        stage: Stage.from(process.env.STAGE) ?? Stage.Dev,
        auth: {
          cookie: {
            secret: process.env.COOKIE_SECRET || '',
          },
          session: {
            secret: process.env.SESSION_SECRET || '',
          },
          providers: {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID || '',
              clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
              redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL || '',
            },
          },
        },
        redis: {
          host: process.env.REDIS_HOST || '',
          port: Number(process.env.REDIS_PORT) || 0,
          username: process.env.REDIS_USERNAME || '',
          password: process.env.REDIS_PASSWORD || '',
        },
        web: {
          baseUrl: process.env.WEB_BASE_URL || '',
        },
      };
    });

  const loadFromSecret = (): Promise<Env> => Promise.reject('Not implemented');

  const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

  const promise = isDevelopment ? loadFromFile() : loadFromSecret();

  return () => promise;
})();

async function env(fastify: FastifyInstance) {
  fastify.decorate('env', await loadEnv());
  fastify.log.level = fastify.env.stage.is(Stage.Dev) ? 'debug' : 'info';
}

export default fp(env);

export { type Env } from './env';
export { default as Stage } from './stage';
