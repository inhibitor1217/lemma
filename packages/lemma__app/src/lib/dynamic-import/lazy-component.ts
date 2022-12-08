import { go } from '@lemma/fx';
import { ComponentType, lazy, ReactNode } from 'react';
import withSuspense from './with-suspense';

export default function lazyComponent<P, ComponentModule extends { default: ComponentType<P> }>(
  fn: () => Promise<ComponentModule>,
  Fallback: ReactNode
) {
  return go(fn, lazy, withSuspense(Fallback));
}
