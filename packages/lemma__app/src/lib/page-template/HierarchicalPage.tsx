import { Client, GNB as GNBLayout, styled } from '@channel.io/bezier-react';
import { ReactNode } from 'react';
import { HStack, StackItem } from '~/lib/layout';

export function HierarchicalPage({
  GNB = null,

  Body = null,
}: {
  /**
   * @default null
   */
  GNB?: ReactNode;

  /**
   * @default null
   */
  Body?: ReactNode;
}) {
  return (
    <Client>
      <HStack align="stretch">
        {GNB && (
          <StackItem>
            <GNBLayout>{GNB}</GNBLayout>
          </StackItem>
        )}

        <StackItem grow shrink weight={1}>
          {Body}
        </StackItem>
      </HStack>
    </Client>
  );
}

export namespace HierarchicalPage {
  export const EmptyPage = styled.div`
    width: 100%;
    height: 100%;
    background-color: var(--bg-white-normal);
  `;
}
