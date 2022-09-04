import { LayoutProvider } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';

export default function Provider({ children }: PropsWithChildren<{}>) {
  return <LayoutProvider>{children}</LayoutProvider>;
}
