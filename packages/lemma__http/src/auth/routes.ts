import crypto from 'crypto';
import { FastifyInstance } from 'fastify';

function nonce() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function routes(fastify: FastifyInstance) {
  fastify.get('/google', async (request, reply) => {
    const oauthAuthorizeUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    const state = nonce();

    oauthAuthorizeUrl.searchParams.set('response_type', 'code');
    oauthAuthorizeUrl.searchParams.set('client_id', fastify.env.auth.providers.google.clientId);
    oauthAuthorizeUrl.searchParams.set('scope', 'openid profile email');
    oauthAuthorizeUrl.searchParams.set('redirect_uri', fastify.env.auth.providers.google.redirectUrl);
    oauthAuthorizeUrl.searchParams.set('state', state);

    request.session.set('state', state);

    reply.redirect(302, oauthAuthorizeUrl.href);
  });

  fastify.get('/google/redirect', async (request, reply) => {
    reply.statusCode = 501;
    reply.send('Not implemented');
  });
}
