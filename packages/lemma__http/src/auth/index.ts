import cookie from '@fastify/cookie';
import session from '@fastify/session';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/env';

declare module 'fastify' {
  interface Session {
    // @todo
  }
}

async function auth(fastify: FastifyInstance) {
  fastify.register(cookie);
  fastify.register(session, {
    secret: fastify.env.auth.session.secret,
    cookie: {
      httpOnly: true,
      secure: fastify.env.stage.isNot(Stage.Dev),
    },
    // @todo store
    saveUninitialized: false,
  });
}

export default fp(auth);

export { default as routes } from './routes'
