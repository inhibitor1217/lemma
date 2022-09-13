import { styled } from '@channel.io/bezier-react';
import { CSSProperties, PropsWithChildren } from 'react';

const Layout = styled.div`
  padding-top: var(--padding-top);
  padding-right: var(--padding-right);
  padding-bottom: var(--padding-bottom);
  padding-left: var(--padding-left);
`;

export default function Padding({
  equal,
  horizontal,
  vertical,
  left,
  top,
  right,
  bottom,
  children,
}: PropsWithChildren<{
  equal?: number;
  horizontal?: number;
  vertical?: number;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}>) {
  return (
    <Layout
      style={
        {
          '--padding-top': `${top ?? vertical ?? equal ?? 0}px`,
          '--padding-right': `${right ?? horizontal ?? equal ?? 0}px`,
          '--padding-bottom': `${bottom ?? vertical ?? equal ?? 0}px`,
          '--padding-left': `${left ?? horizontal ?? equal ?? 0}px`,
        } as CSSProperties
      }
    >
      {children}
    </Layout>
  );
}
