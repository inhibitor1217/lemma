import formbody from '@fastify/formbody';
import { AuthProvider } from '@lemma/prisma-client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fetch from 'node-fetch';
import { nonce } from './lib/csrf';
import {
  type GoogleOAuth2IdTokenPayload,
  type GoogleOAuth2TokenResponse,
} from './lib/google-oauth2';

declare module 'fastify' {
  interface Session {
    state?: string;
  }
}

function makeName(firstName?: string, lastName?: string): string | undefined {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName ?? lastName;
}

async function gidc(fastify: FastifyInstance) {
  fastify.register(formbody);

  fastify.post(
    '/',
    {
      /**
       * @see https://developers.google.com/identity/gsi/web/reference/html-reference#server-side
       */
      schema: {
        body: {
          type: 'object',
          properties: {
            g_csrf_token: { type: 'string' },
            credential: { type: 'string' },
          },
          required: ['g_csrf_token', 'credential'],
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: {
          g_csrf_token: string;
          credential: string;
        };
      }>,
      reply
    ) => {
      const cookieCsrfToken = request.cookies.g_csrf_token;

      if (!cookieCsrfToken || cookieCsrfToken !== request.body.g_csrf_token) {
        return reply.status(400).send('Invalid CSRF Token');
      }

      const ticket = await fastify.googleOAuth2Client.verifyIdToken({
        idToken: request.body.credential,
        audience: fastify.env.auth.providers.google.clientId,
      });

      const {
        sub: providerId,
        email,
        given_name: firstName,
        family_name: lastName,
        picture: photoUrl,
      } = ticket.getPayload() as GoogleOAuth2IdTokenPayload;

      const name = makeName(firstName, lastName);

      const account =
        (await fastify.rdb.account.findUnique({
          where: {
            authProvider_authProviderId: {
              authProvider: AuthProvider.GOOGLE,
              authProviderId: providerId,
            },
          },
        })) ??
        (await fastify.rdb.account.create({
          data: {
            authProvider: AuthProvider.GOOGLE,
            authProviderId: providerId,
            firstName,
            lastName,
            name,
            email,
            photo: photoUrl,
          },
        }));

      request.session.accountId = account.id;

      return { account };
    }
  );
}

export default async function routes(fastify: FastifyInstance) {
  fastify.get(
    '/google',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            redirect_to: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          redirect_to?: string;
        };
      }>,
      reply
    ) => {
      const oauthAuthorizeUrl = new URL(
        'https://accounts.google.com/o/oauth2/v2/auth'
      );
      const state = new URLSearchParams();

      const _nonce = nonce();

      state.set('nonce', _nonce);
      if (request.query.redirect_to) {
        state.set('redirect_to', request.query.redirect_to);
      }

      oauthAuthorizeUrl.searchParams.set('response_type', 'code');
      oauthAuthorizeUrl.searchParams.set(
        'client_id',
        fastify.env.auth.providers.google.clientId
      );
      oauthAuthorizeUrl.searchParams.set('scope', 'openid profile email');
      oauthAuthorizeUrl.searchParams.set(
        'redirect_uri',
        fastify.env.auth.providers.google.redirectUrl
      );
      oauthAuthorizeUrl.searchParams.set('state', state.toString());

      request.session.set('state', _nonce);

      reply.redirect(302, oauthAuthorizeUrl.href);
    }
  );

  fastify.get(
    '/google/redirect',
    {
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
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          state: string;
          code: string;
        };
      }>,
      reply
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

      const oauthAccessTokenUrl = new URL(
        'https://oauth2.googleapis.com/token'
      );

      oauthAccessTokenUrl.searchParams.set('code', request.query.code);
      oauthAccessTokenUrl.searchParams.set(
        'client_id',
        fastify.env.auth.providers.google.clientId
      );
      oauthAccessTokenUrl.searchParams.set(
        'client_secret',
        fastify.env.auth.providers.google.clientSecret
      );
      oauthAccessTokenUrl.searchParams.set(
        'redirect_uri',
        fastify.env.auth.providers.google.redirectUrl
      );
      oauthAccessTokenUrl.searchParams.set('grant_type', 'authorization_code');

      const { id_token } = await fetch(oauthAccessTokenUrl.href, {
        method: 'POST',
      }).then((res) => res.json() as Promise<GoogleOAuth2TokenResponse>);

      const ticket = await fastify.googleOAuth2Client.verifyIdToken({
        idToken: id_token,
        audience: fastify.env.auth.providers.google.clientId,
      });

      const {
        sub: providerId,
        email,
        given_name: firstName,
        family_name: lastName,
        picture: photoUrl,
      } = ticket.getPayload() as GoogleOAuth2IdTokenPayload;

      const name = makeName(firstName, lastName);

      const account =
        (await fastify.rdb.account.findUnique({
          where: {
            authProvider_authProviderId: {
              authProvider: AuthProvider.GOOGLE,
              authProviderId: providerId,
            },
          },
        })) ??
        (await fastify.rdb.account.create({
          data: {
            authProvider: AuthProvider.GOOGLE,
            authProviderId: providerId,
            firstName,
            lastName,
            name,
            email,
            photo: photoUrl,
          },
        }));

      request.session.accountId = account.id;

      if (redirectTo) {
        return reply.redirect(302, redirectTo);
      }

      reply.statusCode = 200;
    }
  );

  fastify.register(gidc, { prefix: '/gidc' });
}
