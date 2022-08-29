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
  fastify.get('/google', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          redirect_to: { type: 'string' },
        },
      },
    },
  }, async (
    request: FastifyRequest<{
      Querystring: {
        redirect_to?: string;
      };
    }>,
    reply,
  ) => {
    const oauthAuthorizeUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const state = new URLSearchParams();

    const _nonce = nonce();

    state.set('nonce', _nonce);
    if (request.query.redirect_to) {
      state.set('redirect_to', request.query.redirect_to);
    }

    oauthAuthorizeUrl.searchParams.set('response_type', 'code');
    oauthAuthorizeUrl.searchParams.set('client_id', fastify.env.auth.providers.google.clientId);
    oauthAuthorizeUrl.searchParams.set('scope', 'openid profile email');
    oauthAuthorizeUrl.searchParams.set('redirect_uri', fastify.env.auth.providers.google.redirectUrl);
    oauthAuthorizeUrl.searchParams.set('state', state.toString());

    request.session.set('state', _nonce);

    reply.redirect(302, oauthAuthorizeUrl.href);
  });

  fastify.get('/google/redirect', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          state: { type: 'string' },
          code: { type: 'string' },
        },
        required: ['state', 'code'],
      },
    },
  }, async (
    request: FastifyRequest<{
      Querystring: {
        state: string;
        code: string;
      };
    }>,
    reply,
  ) => {
    const state = new URLSearchParams(request.query.state);
    const nonce = state.get('nonce');
    const redirectTo = state.get('redirect_to');

    if (request.session.state !== nonce) {
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
      await fastify.rdb.account.findUnique({
        where: {
          authProvider_authProviderId: {
            authProvider: AuthProvider.GOOGLE,
            authProviderId: providerId,
          },
        },
      }) ??
      await fastify.rdb.account.create({
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

    request.session.accountId = account.id;

    if (redirectTo) {
      return reply.redirect(302, redirectTo);
    }

    reply.statusCode = 200;
  });
}
