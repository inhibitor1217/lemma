import { HttpApi } from '~/lib/net/http-api';
import { RQuery } from '~/lib/react-query';

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
        createdAt: string;
        updatedAt: string;
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
}

export namespace AuthHttpApi__RQ {
  export const getMyAccount = RQuery.makeKey('auth', 'http-api', 'getMyAccount');
}
