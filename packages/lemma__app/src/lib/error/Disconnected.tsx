import { Icon, IconSize, WifiOffIcon } from '@channel.io/bezier-react';
import { i18ntext } from '~/lib/i18n';
import { Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

export default function Disconnected() {
  return (
    <Sized width={240} height={160}>
      <VStack align="center" justify="center">
        <StackItem>
          <Icon source={WifiOffIcon} size={IconSize.L} color="txt-black-darkest" />
        </StackItem>
        <StackItem marginBefore={4}>
          <Text typo={Typography.Size15} color="txt-black-darkest">
            {i18ntext('Disconnected!')}
          </Text>
        </StackItem>
        <StackItem>
          <Text typo={Typography.Size12} color="txt-black-darker">
            {i18ntext('Please check your network connection.')}
          </Text>
        </StackItem>
      </VStack>
    </Sized>
  );
}
