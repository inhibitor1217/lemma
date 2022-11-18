import { keyframes, styled } from '@channel.io/bezier-react';
import { StackItem, VStack } from '~/lib/layout';

export namespace Skeleton {
  const SkeletonAvatar = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 42%;
    background-color: var(--bg-black-dark);
  `;

  const skeletonContentKeyframes = keyframes`
    0% {
      background-color: var(--bg-black-lighter);
    }

    50% {
      background-color: var(--bg-black-lightest);
    }

    100% {
      background-color: var(--bg-black-lighter);
    }
  `;

  const SkeletonContent = styled.div`
    width: 50%;
    height: 24px;
    ${({ foundation }) => foundation?.rounding.round8}
    background-color: var(--bg-black-lighter);
    animation: ${() => skeletonContentKeyframes} 2s ease-in-out infinite;
  `;

  export function Profile() {
    return (
      <VStack spacing={8}>
        <StackItem>
          <SkeletonAvatar />
        </StackItem>

        <StackItem align="stretch" marginBefore={16}>
          <SkeletonContent />
        </StackItem>
      </VStack>
    );
  }
}
