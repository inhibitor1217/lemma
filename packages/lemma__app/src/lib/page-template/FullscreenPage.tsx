import { Spinner, styled } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';
import { Center } from '~/lib/layout';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--bg-white-normal);
`;

export function FullscreenPage({ children }: PropsWithChildren<{}>) {
  return <Background>{children}</Background>;
}

export namespace FullscreenPage {
  export const Loading = () => (
    <FullscreenPage>
      <Center>
        <Spinner color="txt-black-dark" />
      </Center>
    </FullscreenPage>
  )
}
