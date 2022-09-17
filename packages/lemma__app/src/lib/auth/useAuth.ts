import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Account, AccountAtom } from '~/lib/account';
import { GoogleSignIn } from '~/lib/auth-integration/google-sign-in';
import { go, IO, Option, Struct } from '~/lib/fx';
import { RMutation, RQuery } from '~/lib/react-query';
import { AuthHttpApi, AuthHttpApi__Resolver, AuthHttpApi__RQ } from './http-api';

export function useAuthQuery() {
  const setMyAccount = useSetRecoilState(AccountAtom.me);

  return useQuery(AuthHttpApi__RQ.getMyAccount, AuthHttpApi.getMyAccount, {
    ...RQuery.defaultOptions,
    onSuccess: (data: AuthHttpApi.GetMyAccountDTO['Result']) =>
      go(
        data,
        Struct.pick('account'),
        AuthHttpApi__Resolver.Account.fromGetMyAccountResultDTO,
        IO.of,
        IO.map(setMyAccount),
        IO.run
      ),
  });
}

const authProviderSignOutEffect = (account: Account): IO<void> =>
  ({
    GOOGLE: GoogleSignIn.signOut,
  }[account.authProvider]);

export function useAuthSignOutMutation() {
  const queryClient = useQueryClient();
  const myAccount = useRecoilValue(AccountAtom.me);
  const setMyAccount = useSetRecoilState(AccountAtom.me);

  return useMutation(AuthHttpApi.signOut, {
    ...RMutation.defaultOptions,
    mutationKey: AuthHttpApi__RQ.signOut,
    onMutate: () =>
      go(
        IO.of(() => setMyAccount(Option.none())),
        IO.flatMap(() => Option.reduce(authProviderSignOutEffect, () => IO.of(undefined))(myAccount)),
        IO.flatMap(() => () => {
          queryClient.invalidateQueries(AuthHttpApi__RQ.getMyAccount);
        }),
        IO.run
      ),
  });
}
