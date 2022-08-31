import formbody from '@fastify/formbody';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fetch from 'node-fetch';
import { nonce } from '../lib/csrf';
import {
  accountFromGoogleOAuth2Token,
  buildGoogleOAuth2AuthorizeUrl,
  buildGoogleOAuth2TokenUrl,
  type GoogleOAuth2IdTokenPayload,
  type GoogleOAuth2TokenResponse,
} from '../lib/google-oauth2';

declare module 'fastify' {
  interface Session {
    state?: string;
  }
}

export default async function google(fastify: FastifyInstance) {
  /**
   * @note POST /ids accepts x-www-form-urlencoded body
   */
  fastify.register(formbody);

  fastify.get(
    '/',
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
      const csrfToken = nonce();

      const authorizeUrl = await buildGoogleOAuth2AuthorizeUrl(fastify, {
        nonce: csrfToken,
        redirectUrl: request.query.redirect_to,
      });

      request.session.set('state', csrfToken);

      return reply.redirect(302, authorizeUrl.href);
    }
  );

  fastify.get(
    '/redirect',
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
        return reply.status(400).send('Invalid authentication request state');
      }

      if (!request.query.code) {
        return reply.status(400).send('Invalid authentication request code');
      }

      const tokenUrl = await buildGoogleOAuth2TokenUrl(fastify, {
        code: request.query.code,
      });

      const { id_token }: GoogleOAuth2TokenResponse = await fetch(tokenUrl.href, {
        method: 'POST',
      }).then((res) => res.json());

      const ticket = await fastify.googleOAuth2Client.verifyIdToken({
        idToken: id_token,
        audience: fastify.env.auth.providers.google.clientId,
      });

      const account = await accountFromGoogleOAuth2Token(fastify, ticket.getPayload() as GoogleOAuth2IdTokenPayload);

      request.session.accountId = account.id;

      if (redirectTo) {
        return reply.redirect(302, redirectTo);
      }

      return reply.status(204).send();
    }
  );

  fastify.post(
    '/ids',
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

      const account = await accountFromGoogleOAuth2Token(fastify, ticket.getPayload() as GoogleOAuth2IdTokenPayload);

      request.session.accountId = account.id;

      return { account };
    }
  );
}
