import { FastifyInstance } from 'fastify';
import { JwtDecodedPayload } from '~/lib/jwt';

export namespace SessionRefreshConfig {
  export const COOKIE_NAME = 'l_session_refresh';
  export const SUBJECT = 'session_refresh';
  export const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;
  export const MAX_AGE_SECONDS = MAX_AGE_MS / 1000;
  export const IMMINENT_MS = 1000 * 60 * 60 * 24 * 3;
  export const IMMINENT_SECONDS = IMMINENT_MS / 1000;
}

export type RefreshTokenPayload = {
  accountId: number;
};

export async function signRefreshToken(fastify: FastifyInstance, payload: RefreshTokenPayload): Promise<string> {
  return fastify.signJwt(payload, fastify.env.auth.cookie.secret, {
    subject: SessionRefreshConfig.SUBJECT,
    expireDurationSeconds: SessionRefreshConfig.MAX_AGE_SECONDS,
  });
}

export async function decodeRefreshToken(
  fastify: FastifyInstance,
  token: string
): Promise<JwtDecodedPayload<RefreshTokenPayload>> {
  return fastify.verifyJwt<RefreshTokenPayload>(token, fastify.env.auth.cookie.secret, {
    subject: SessionRefreshConfig.SUBJECT,
  });
}
