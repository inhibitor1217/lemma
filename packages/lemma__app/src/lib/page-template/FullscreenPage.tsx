import { styled } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--bg-white-normal);
`;

export default function FullscreenPage({ children }: PropsWithChildren<{}>) {
  return <Background>{children}</Background>;
}
