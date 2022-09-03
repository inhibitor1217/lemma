import { ComponentType } from 'react';
import { useQuery } from 'react-query';
import { AuthHttpApi, AuthHttpApi__RQ } from './http-api';

export default function withAuth<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  {
    Loading = () => null,
    Error = () => null,
  }: {
    /**
     * @default `() => null`
     */
    Loading?: ComponentType<P>;

    /**
     * @default `() => null`
     */
    Error?: ComponentType<P>;
  }
): ComponentType<P> {
  return (props: P) => {
    const result = useQuery(AuthHttpApi__RQ.getMyAccount, AuthHttpApi.getMyAccount);

    if (result.isLoading) {
      return <Loading {...props} />;
    }

    if (result.isError) {
      return <Error {...props} />;
    }

    return <Component {...props} />;
  };
}
