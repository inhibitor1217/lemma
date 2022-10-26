import { ComponentType, lazy, ReactNode } from 'react';
import { go } from '~/lib/fx';
import withSuspense from './with-suspense';

export default function lazyComponent<P, ComponentModule extends { default: ComponentType<P> }>(
  fn: () => Promise<ComponentModule>,
  Fallback: ReactNode
) {
  return go(fn, lazy, withSuspense(Fallback));
}
