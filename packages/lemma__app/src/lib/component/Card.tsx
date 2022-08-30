import { styled } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';

const Elevation = styled.div`
  width: 100%;
  height: 100%;
  ${({ foundation }) => foundation?.rounding.round16}
  ${({ foundation }) => foundation?.elevation.ev3()}
`;

export default function Card({
  children,
  padding = 16,
}: PropsWithChildren<{
  padding?: number;
}>) {
  return <Elevation style={{ padding }}>{children}</Elevation>;
}
