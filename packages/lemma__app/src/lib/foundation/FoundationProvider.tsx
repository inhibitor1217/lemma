import { BezierProvider, DarkFoundation } from '@channel.io/bezier-react';
import { type PropsWithChildren } from 'react';

export default function FoundationProvider({
  children,
}: PropsWithChildren<{}>) {
  return (
    <BezierProvider foundation={DarkFoundation}>{children}</BezierProvider>
  );
}
