import { forwardRef } from 'react';
import { ComponentType, ReactNode, Suspense } from 'react';

export default function withSuspense(Fallback: ReactNode) {
  return <P, R>(Component: ComponentType<P>) =>
    forwardRef<R, P>((props, ref) => (
      <Suspense fallback={Fallback}>
        <Component ref={ref} {...props} />
      </Suspense>
    ));
}
