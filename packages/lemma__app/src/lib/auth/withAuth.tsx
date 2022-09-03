import { ComponentType } from 'react';

export default function withAuth<P>(Component: ComponentType<P>): ComponentType<P> {
  return Component;
}
