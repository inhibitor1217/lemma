import { Spinner, styled } from '@channel.io/bezier-react';
import { PropsWithChildren } from 'react';
import { Center, Padding } from '~/lib/layout';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--bg-white-normal);
`;

const YScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
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
  );

  const PAGE_HORIZONTAL_PADDING_PX = 60;
  const PAGE_VERTICAL_PADDING_PX = 32;

  export const Padded = ({ children }: PropsWithChildren<{}>) => (
    <FullscreenPage>
      <YScrollContainer>
        <Padding horizontal={PAGE_HORIZONTAL_PADDING_PX} vertical={PAGE_VERTICAL_PADDING_PX}>
          {children}
        </Padding>
      </YScrollContainer>
    </FullscreenPage>
  );
}
