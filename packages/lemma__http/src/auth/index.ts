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
  SESSION_REFRESH_COOKIE_NAME,
  SESSION_REFRESH_MAX_AGE_SECONDS,
  SESSION_REFRESH_SUBJECT,
} from './config';

type SignInOptions = {
  accountId: number;
};

type RefreshTokenPayload = {
  accountId: number;
}

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

async function signRefreshToken(fastify: FastifyInstance, payload: RefreshTokenPayload): Promise<string> {
  return fastify.signJwt(
    payload,
    fastify.env.auth.cookie.secret,
    {
      subject: SESSION_REFRESH_SUBJECT,
      expireDurationSeconds: SESSION_REFRESH_MAX_AGE_SECONDS,
    },
  )
}

async function decodeRefreshToken(fastify: FastifyInstance, token: string): Promise<RefreshTokenPayload> {
  return fastify.verifyJwt<RefreshTokenPayload>(
    token,
    fastify.env.auth.cookie.secret,
    {
      subject: SESSION_REFRESH_SUBJECT,
    },
  )
}

async function auth(fastify: FastifyInstance) {
  fastify.register(cookie);

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
    this.setCookie(
      SESSION_REFRESH_COOKIE_NAME,
      await signRefreshToken(fastify, { accountId: opts.accountId }),
      {
        path: '/',
        maxAge: SESSION_REFRESH_MAX_AGE_SECONDS,
        httpOnly: true,
        secure: fastify.env.stage.isNot(Stage.Dev),
      },
    );
  });

  fastify.decorateRequest('signOut', async function signOut() {
    await this.session.destroy();
  });

  fastify.decorateReply('signOut', async function signOut() {
    this.clearCookie('sessionId');
    this.clearCookie(SESSION_REFRESH_COOKIE_NAME);
  });

  fastify.addHook('onRequest', async function refreshSession(request, reply) {
    if (request.session.accountId !== undefined) {
      return;
    }

    const sessionRefreshCookie = request.cookies[SESSION_REFRESH_COOKIE_NAME];
    if (!sessionRefreshCookie) {
      return;
    }

    try {
      const { accountId } = await decodeRefreshToken(fastify, sessionRefreshCookie);

      request.session.accountId = accountId;
    } catch (e) {
      return;
    }
  });
}

export default fp(auth);

export { default as routes } from './routes';
