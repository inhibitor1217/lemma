import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { OAuth2Client } from 'google-auth-library';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2Client: OAuth2Client;
  }
}

export default fp(async function googleOAuth2Client(fastify: FastifyInstance) {
  fastify.decorate('googleOAuth2Client', new OAuth2Client(fastify.env.auth.providers.google.clientId));
});
