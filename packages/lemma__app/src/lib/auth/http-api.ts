import { type AuthProvider } from '@lemma/prisma-client';
import { type Account } from '~/lib/account';
import { FieldResolver, PrimitiveType } from '~/lib/field';
import { Option, Struct } from '~/lib/fx';
import { HttpApi } from '~/lib/net/http-api';
import { RMutation, RQuery } from '~/lib/react-query';

export namespace AuthHttpApi {
  export type SignInWithGoogleDTO = {
    Request: {
      credential: string;
      redirectTo?: string;
      csrfToken?: string;
    };
  };

  export const signInWithGoogle = (requestDto: SignInWithGoogleDTO['Request']) => {
    const params = new URLSearchParams();
    if (requestDto.redirectTo) {
      params.set('redirect_to', requestDto.redirectTo);
    }

    return HttpApi.post(HttpApi.url('/auth/google/ids', params), {
      g_csrf_token: requestDto.csrfToken,
      credential: requestDto.credential,
    });
  };

  export type GetMyAccountDTO = {
    Result: {
      account: {
        id: number;
        createdAt: PrimitiveType.ISO8601DateTime;
        updatedAt: PrimitiveType.ISO8601DateTime;
        authProvider: string;
        authProviderId: string;
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
        photo?: string;
      };
    };
  };

  export const getMyAccount = () => HttpApi.get<GetMyAccountDTO['Result']>(HttpApi.url('/account/me'));

  export type SignOutDTO = {};

  export const signOut = () => HttpApi.delete_(HttpApi.url('/account/me/logout'));
}

export namespace AuthHttpApi__RQ {
  export const getMyAccount = RQuery.makeKey('auth', 'http-api', 'getMyAccount');

  export const signOut = RMutation.makeKey('auth', 'http-api', 'signOut');
}

export namespace AuthHttpApi__Resolver {
  export namespace Account {
    export const fromGetMyAccountResultDTO: (accountDTO: AuthHttpApi.GetMyAccountDTO['Result']['account']) => Account =
      Struct.evolve({
        id: FieldResolver.ID,
        createdAt: FieldResolver.Date.fromISO8601,
        updatedAt: FieldResolver.Date.fromISO8601,
        authProvider: FieldResolver.Enumeration<AuthProvider>,
        authProviderId: FieldResolver.String,
        firstName: Option.map(FieldResolver.String),
        lastName: Option.map(FieldResolver.String),
        name: Option.map(FieldResolver.String),
        email: Option.map(FieldResolver.Email),
        photo: Option.map(FieldResolver.URL),
      });
  }
}
