import { ErrorTriangleFilledIcon, Icon, IconSize } from '@channel.io/bezier-react';
import { text } from '~/lib/i18n';
import { Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

export default function Unknown() {
  return (
    <Sized width={240} height={160}>
      <VStack align="center" justify="center">
        <StackItem>
          <Icon source={ErrorTriangleFilledIcon} size={IconSize.L} color="txt-black-darkest" />
        </StackItem>
        <StackItem>
          <Text typo={Typography.Size15} color="txt-black-darker">
            {text('Oops! Something went wrong.')}
          </Text>
        </StackItem>
      </VStack>
    </Sized>
  );
}
