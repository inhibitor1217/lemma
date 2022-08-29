import cookie from '@fastify/cookie';
import session from '@fastify/session';
import connectRedis from 'connect-redis';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/env';
import { SESSION_MAX_AGE_MS, SESSION_MAX_AGE_SECONDS } from './session';

declare module 'fastify' {
  interface Session {
    accountId: number;
  }
}

/**
 * @see https://github.com/fastify/session#typescript-support
 */
const RedisStore = connectRedis(session as any);

async function auth(fastify: FastifyInstance) {
  fastify.register(cookie);
  fastify.register(session, {
    secret: fastify.env.auth.session.secret,
    cookie: {
      maxAge: SESSION_MAX_AGE_MS,
      httpOnly: true,
      secure: fastify.env.stage.isNot(Stage.Dev),
    },
    /**
     * @see https://github.com/fastify/session#typescript-support
     */
    store: new RedisStore({
      client: fastify.redis,
      ttl: SESSION_MAX_AGE_SECONDS,
    }) as any,
    saveUninitialized: false,
  });
}

export default fp(auth);

export { default as routes } from './routes'
