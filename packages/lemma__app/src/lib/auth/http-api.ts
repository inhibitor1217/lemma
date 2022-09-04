import { HttpApi } from '~/lib/net/http-api';
import { RQuery } from '~/lib/react-query';

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

  export const getMyAccount = () => HttpApi.get<GetMyAccountDTO['Result']>(HttpApi.url('/account/me'));
}

export namespace AuthHttpApi__RQ {
  export const getMyAccount = RQuery.makeKey('auth', 'http-api', 'getMyAccount');
}
