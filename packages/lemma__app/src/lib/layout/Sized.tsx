import {
  type PropsWithChildren,
} from 'react';

export default function Sized({
  children,
  width,
  height,
}: PropsWithChildren<{
  width?: number;
  height?: number;
}>) {
  return (
    <div style={{ width, height }}>
      {children}
    </div>
  );
}
