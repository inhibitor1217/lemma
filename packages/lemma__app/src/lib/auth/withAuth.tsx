import { ComponentType } from 'react';
import { Error } from '~/lib/error';
import { useAuthQuery } from './useAuth';

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
    const authQueryResult = useAuthQuery();

    if (authQueryResult.isLoading) {
      return <LoadingComponent {...props} />;
    }

    if (authQueryResult.isError) {
      return <ErrorComponent error={Error.from(authQueryResult.error)} {...props} />;
    }

    return <Component {...props} />;
  };
}
