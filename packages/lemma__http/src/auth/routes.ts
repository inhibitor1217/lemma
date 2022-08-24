import {
  AuthProvider,
} from '@lemma/prisma-client';
import crypto from 'crypto';
import {
  FastifyInstance,
  FastifyRequest,
} from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import fetch from 'node-fetch';

declare module 'fastify' {
  interface Session {
    state?: string
  }
}

type GoogleOAuth2TokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
  refresh_token?: string;
}

type GoogleOAuth2IdTokenPayload = {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

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

  fastify.get('/google/redirect', async (
    request: FastifyRequest<{
      Querystring: {
        state: string;
        code: string;
      }
    }>,
    reply,
  ) => {
    if (request.session.state !== request.query.state) {
      reply.statusCode = 401;
      return reply.send('Invalid authentication request state');
    }

    if (!request.query.code) {
      reply.statusCode = 401;
      return reply.send('Invalid authentication request code');
    }

    const oauthAccessTokenUrl = new URL('https://oauth2.googleapis.com/token');

    oauthAccessTokenUrl.searchParams.set('code', request.query.code);
    oauthAccessTokenUrl.searchParams.set('client_id', fastify.env.auth.providers.google.clientId);
    oauthAccessTokenUrl.searchParams.set('client_secret', fastify.env.auth.providers.google.clientSecret);
    oauthAccessTokenUrl.searchParams.set('redirect_uri', fastify.env.auth.providers.google.redirectUrl);
    oauthAccessTokenUrl.searchParams.set('grant_type', 'authorization_code');

    const { id_token } = await fetch(oauthAccessTokenUrl.href, { method: 'POST' })
      .then(res => res.json() as Promise<GoogleOAuth2TokenResponse>);

    const payload = jwt.decode(id_token);

    if (!payload || typeof payload === 'string') {
      reply.statusCode = 400;
      return reply.send('Invalid authentication id token');
    }

    const {
      sub: providerId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture: photoUrl,
    } = payload as JwtPayload & GoogleOAuth2IdTokenPayload;

    const name = (() => {
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
      return firstName ?? lastName;
    })();

    const account =
      await fastify.db.account.findUnique({
        where: {
          authProvider_authProviderId: {
            authProvider: AuthProvider.GOOGLE,
            authProviderId: providerId,
          },
        },
      }) ??
      await fastify.db.account.create({
        data: {
          authProvider: AuthProvider.GOOGLE,
          authProviderId: providerId,
          firstName,
          lastName,
          name,
          email,
          photo: photoUrl,
        },
      });

    // @todo create a session to the current user

    reply.statusCode = 501;
    reply.send('Not implemented');
  });
}
