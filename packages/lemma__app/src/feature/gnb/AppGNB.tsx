import { styled } from '@channel.io/bezier-react';
import { Spacer, StackItem, VStack } from '~/lib/layout';
import GNBMyAccountButton from './GNBMyAccountButton';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 6px;
`;

export default function AppGNB() {
  return (
    <Layout>
      <VStack align="stretch">
        <Spacer />
        <StackItem>
          <GNBMyAccountButton />
        </StackItem>
      </VStack>
    </Layout>
  );
}
