import { HttpApi, HttpClient } from '~/lib/net';
import { makeQueryKey } from '~/lib/react-query';

export namespace AuthHttpApi {
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

  export const getMyAccount = (): Promise<GetMyAccountDTO['Result']> => HttpClient.get(HttpApi.url('/account/me'));
}

export namespace AuthHttpApi__RQ {
  export const getMyAccount = makeQueryKey('auth', 'http-api', 'getMyAccount');
}
