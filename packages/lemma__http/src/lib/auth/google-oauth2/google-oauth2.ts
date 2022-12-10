import { Account, AuthProvider } from '@lemma/prisma-client';
import { FastifyInstance } from 'fastify';

export type GoogleOAuth2TokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
  refresh_token?: string;
};

export type GoogleOAuth2IdTokenPayload = {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

const GOOGLE_OAUTH2_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_OAUTH2_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export async function buildGoogleOAuth2AuthorizeUrl(
  fastify: FastifyInstance,
  opts: {
    nonce: string;
    redirectUrl?: string;
  }
): Promise<URL> {
  const url = new URL(GOOGLE_OAUTH2_AUTHORIZE_URL);
  const state = new URLSearchParams();

  state.set('nonce', opts.nonce);
  if (opts.redirectUrl) {
    state.set('redirect_to', opts.redirectUrl);
  }

  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', fastify.env.auth.providers.google.clientId);
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('redirect_uri', fastify.env.auth.providers.google.redirectUrl);
  url.searchParams.set('state', state.toString());

  return url;
}

export async function buildGoogleOAuth2TokenUrl(
  fastify: FastifyInstance,
  opts: {
    code: string;
  }
): Promise<URL> {
  const url = new URL(GOOGLE_OAUTH2_TOKEN_URL);

  url.searchParams.set('code', opts.code);
  url.searchParams.set('client_id', fastify.env.auth.providers.google.clientId);
  url.searchParams.set('client_secret', fastify.env.auth.providers.google.clientSecret);
  url.searchParams.set('redirect_uri', fastify.env.auth.providers.google.redirectUrl);
  url.searchParams.set('grant_type', 'authorization_code');

  return url;
}

export async function accountFromGoogleOAuth2Token(
  fastify: FastifyInstance,
  payload: GoogleOAuth2IdTokenPayload
): Promise<Account> {
  function makeName(firstName?: string, lastName?: string): string | undefined {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName ?? lastName;
  }

  const { sub: providerId, email, given_name: firstName, family_name: lastName, picture: photoUrl } = payload;

  const name = makeName(firstName, lastName);

  return (
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
    }))
  );
}
