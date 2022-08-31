import cookie from '@fastify/cookie';
import session from '@fastify/session';
import connectRedis from 'connect-redis';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { OAuth2Client } from 'google-auth-library';
import { Stage } from '~/env';
import { SESSION_MAX_AGE_MS, SESSION_MAX_AGE_SECONDS } from './session';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2Client: OAuth2Client;
  }

  interface Session {
    accountId: number;
  }
}

/**
 * @see https://github.com/fastify/session#typescript-support
 */
const RedisStore = connectRedis(session as any);

const googleOAuth2Client = fp(async function googleOAuth2Client(
  fastify: FastifyInstance
) {
  fastify.decorate(
    'googleOAuth2Client',
    new OAuth2Client(fastify.env.auth.providers.google.clientId)
  );
});

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

  fastify.register(googleOAuth2Client);
}

export default fp(auth);

export { default as routes } from './routes';
