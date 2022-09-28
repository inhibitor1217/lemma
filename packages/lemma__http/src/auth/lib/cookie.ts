import { CookieSerializeOptions } from '@fastify/cookie';
import { FastifyInstance } from 'fastify';
import { Stage } from '~/env';

export function cookieOptions(fastify: FastifyInstance, opts: { maxAgeMs: number }): CookieSerializeOptions {
  return {
    path: '/',
    maxAge: opts.maxAgeMs,
    httpOnly: true,
    secure: fastify.env.stage.isNot(Stage.Dev),
  };
}
