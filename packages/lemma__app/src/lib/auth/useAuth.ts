import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { AccountAtom } from '~/lib/account';
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

export function useAuthSignOutMutation() {
  const queryClient = useQueryClient();
  const setMyAccount = useSetRecoilState(AccountAtom.me);

  return useMutation(AuthHttpApi.signOut, {
    ...RMutation.defaultOptions,
    mutationKey: AuthHttpApi__RQ.signOut,
    onMutate: () =>
      go(
        IO.of(() => setMyAccount(Option.none())),
        IO.flatMap(IO.of(() => queryClient.invalidateQueries(AuthHttpApi__RQ.getMyAccount))),
        IO.run
      ),
  });
}
