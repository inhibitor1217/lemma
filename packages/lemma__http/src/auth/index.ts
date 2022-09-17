import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import session from '@fastify/session';
import connectRedis from 'connect-redis';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/env';
import googleOauth2Client from './lib/google-oauth2-client';
import {
  SESSION_MAX_AGE_MS,
  SESSION_MAX_AGE_SECONDS,
  SILENT_SIGN_IN_COOKIE_NAME,
  SILENT_SIGN_IN_MAX_AGE_SECONDS,
} from './config';

type SignInOptions = {
  accountId: number;
};

declare module 'fastify' {
  interface Session {
    accountId: number;
  }

  interface FastifyRequest {
    signIn(opts: SignInOptions): Promise<void>;
    signOut(): Promise<void>;
  }

  interface FastifyReply {
    signIn(opts: SignInOptions): Promise<void>;
    signOut(): Promise<void>;
  }
}

/**
 * @see https://github.com/fastify/session#typescript-support
 */
const RedisStore = connectRedis(session as any);

async function auth(fastify: FastifyInstance) {
  fastify.register(cookie, {
    secret: fastify.env.auth.cookie.secret,
    hook: false,
  } as FastifyCookieOptions);

  fastify.register(session, {
    secret: fastify.env.auth.session.secret,
    cookie: {
      maxAge: SESSION_MAX_AGE_MS,
      httpOnly: true,
      path: '/',
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

  fastify.register(googleOauth2Client);

  fastify.decorateRequest('signIn', async function signIn(opts: SignInOptions) {
    this.session.accountId = opts.accountId;
  });

  fastify.decorateReply('signIn', async function signIn(opts: SignInOptions) {
    this.setCookie(SILENT_SIGN_IN_COOKIE_NAME, opts.accountId.toString(), {
      path: '/',
      maxAge: SILENT_SIGN_IN_MAX_AGE_SECONDS,
      signed: true,
    });
  });

  fastify.decorateRequest('signOut', async function signOut() {
    await this.session.destroy();
  });

  fastify.decorateReply('signOut', async function signOut() {
    this.clearCookie('sessionId');
    this.clearCookie(SILENT_SIGN_IN_COOKIE_NAME);
  });
}

export default fp(auth);

export { default as routes } from './routes';
