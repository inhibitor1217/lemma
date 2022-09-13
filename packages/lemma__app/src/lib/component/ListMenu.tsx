import { styled } from '@channel.io/bezier-react';
import { Children, PropsWithChildren } from 'react';
import { StackItem, VStack } from '~/lib/layout';

const Layout = styled.div`
  min-width: 200px;
  padding: 6px;
`;

export default function ListMenu({ children }: PropsWithChildren<{}>) {
  return (
    <Layout>
      <VStack align="stretch">
        {Children.map(children, (child) => (
          <StackItem>{child}</StackItem>
        ))}
      </VStack>
    </Layout>
  );
}
