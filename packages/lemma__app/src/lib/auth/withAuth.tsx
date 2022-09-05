import { ComponentType } from 'react';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { AccountAtom } from '~/lib/account';
import { Error } from '~/lib/error';
import { go, IO, Struct } from '~/lib/fx';
import { RQuery } from '~/lib/react-query';
import { AuthHttpApi, AuthHttpApi__Resolver, AuthHttpApi__RQ } from './http-api';

export default function withAuth<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  {
    Loading: LoadingComponent = () => null,
    Error: ErrorComponent = () => null,
  }: {
    /**
     * @default `() => null`
     */
    Loading?: ComponentType<P>;

    /**
     * @default `() => null`
     */
    Error?: ComponentType<P & { error: Error }>;
  }
): ComponentType<P> {
  return (props: P) => {
    const setMyAccount = useSetRecoilState(AccountAtom.me);

    const result = useQuery(AuthHttpApi__RQ.getMyAccount, AuthHttpApi.getMyAccount, {
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

    if (result.isLoading) {
      return <LoadingComponent {...props} />;
    }

    if (result.isError) {
      return <ErrorComponent error={Error.from(result.error)} {...props} />;
    }

    return <Component {...props} />;
  };
}
