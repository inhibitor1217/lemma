import cookie from '@fastify/cookie';
import session from '@fastify/session';
import { Account } from '@lemma/prisma-client';
import connectRedis from 'connect-redis';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { SESSION_MAX_AGE_MS, SESSION_MAX_AGE_SECONDS } from '~/config/auth';
import { cookieOptions, decodeRefreshToken, signRefreshToken, SessionRefreshConfig } from '~/lib/auth/session';
import { Jwt } from '~/lib/jwt';
import googleOauth2Client from './google-oauth2';

type SignInOptions = {
  accountId: number;
};

declare module 'fastify' {
  interface Session {
    accountId: Account['id'];
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
  fastify.register(cookie);

  fastify.register(session, {
    secret: fastify.env.auth.session.secret,
    cookie: cookieOptions(fastify, { maxAgeMs: SESSION_MAX_AGE_MS }),
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
      SessionRefreshConfig.COOKIE_NAME,
      await signRefreshToken(fastify, { accountId: opts.accountId }),
      cookieOptions(fastify, { maxAgeMs: SessionRefreshConfig.MAX_AGE_MS })
    );
  });

  fastify.decorateRequest('signOut', async function signOut() {
    await this.session.destroy();
  });

  fastify.decorateReply('signOut', async function signOut() {
    this.clearCookie('sessionId');
    this.clearCookie(SessionRefreshConfig.COOKIE_NAME);
  });

  fastify.addHook('onRequest', async function refreshSession(request, reply) {
    if (request.session.accountId !== undefined) {
      return;
    }

    const sessionRefreshCookie = request.cookies[SessionRefreshConfig.COOKIE_NAME];
    if (!sessionRefreshCookie) {
      return;
    }

    try {
      const payload = await decodeRefreshToken(fastify, sessionRefreshCookie);

      if (Jwt.isExpireImminent(payload, SessionRefreshConfig.IMMINENT_MS)) {
        reply.setCookie(
          SessionRefreshConfig.COOKIE_NAME,
          await signRefreshToken(fastify, { accountId: payload.accountId }),
          cookieOptions(fastify, { maxAgeMs: SessionRefreshConfig.MAX_AGE_MS })
        );
      }

      request.session.accountId = payload.accountId;
    } catch (e) {
      return;
    }
  });
}

export default fp(auth);
