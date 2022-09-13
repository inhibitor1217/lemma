import { styled } from '@channel.io/bezier-react';
import { Children, ReactNode } from 'react';
import { Spacer, StackItem, VStack } from '~/lib/layout';
import GNBMyAccountButton from './GNBMyAccountButton';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 6px;
`;

function AppGNBLayout({ Top = null, Bottom = null }: { Top?: ReactNode; Bottom?: ReactNode }) {
  return (
    <Layout>
      <VStack align="stretch">
        {Children.map(Top, (child) => (
          <StackItem>{child}</StackItem>
        ))}

        <Spacer />

        {Children.map(Bottom, (child) => (
          <StackItem>{child}</StackItem>
        ))}
      </VStack>
    </Layout>
  );
}

export default function AppGNB() {
  return <AppGNBLayout Bottom={[<GNBMyAccountButton />]} />;
}
