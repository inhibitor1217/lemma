import { HttpApi, HttpClient } from '~/lib/net';

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
