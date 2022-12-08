import { go, IO, Option, pipe, Struct, Task } from '@lemma/fx';
import { useQueryClient } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Account, AccountAtom } from '~/lib/account';
import { GoogleSignIn } from '~/lib/auth-integration/google-sign-in';
import { useMutation, useQuery } from '~/lib/react-query';
import { AuthHttpApi, AuthHttpApi__Resolver, AuthHttpApi__RQ } from './http-api';

const getMyAccountKey = AuthHttpApi__RQ.getMyAccount;

const getMyAccount = go(
  AuthHttpApi.getMyAccount,
  Task.mapLeft(
    Struct.evolve({
      account: AuthHttpApi__Resolver.Account.fromGetMyAccountResultDTO,
    })
  )
);

export function useAuthQuery() {
  const setMyAccount = useSetRecoilState(AccountAtom.me);

  return useQuery(getMyAccountKey, getMyAccount, {
    onSuccess: pipe(Struct.pick('account'), (account) => IO.of(Option.some(account)), IO.map(setMyAccount), IO.run),
  });
}

const authProviderSignOutEffect = (account: Account): IO<void> =>
  ({
    GOOGLE: GoogleSignIn.signOut,
  }[account.authProvider]);

const signOutKey = AuthHttpApi__RQ.signOut;
const signOut = AuthHttpApi.signOut;

export function useAuthSignOutMutation() {
  const queryClient = useQueryClient();
  const myAccount = useRecoilValue(AccountAtom.me);
  const setMyAccount = useSetRecoilState(AccountAtom.me);

  return useMutation(signOutKey, signOut, {
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
