import { ComponentType } from 'react';
import { useQuery } from 'react-query';
import { Error } from '~/lib/error';
import { RQuery } from '~/lib/react-query';
import { AuthHttpApi, AuthHttpApi__RQ } from './http-api';

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
    const result = useQuery(AuthHttpApi__RQ.getMyAccount, AuthHttpApi.getMyAccount, RQuery.defaultOptions);

    if (result.isLoading) {
      return <LoadingComponent {...props} />;
    }

    if (result.isError) {
      return <ErrorComponent error={Error.from(result.error)} {...props} />;
    }

    return <Component {...props} />;
  };
}
