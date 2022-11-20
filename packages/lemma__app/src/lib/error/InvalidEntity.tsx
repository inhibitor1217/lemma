import { ErrorTriangleFilledIcon, Icon, IconSize } from '@channel.io/bezier-react';
import { i18ntext } from '~/lib/i18n';
import { Sized, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

export default function InvalidEntity() {
  return (
    <Sized width={240} height={160}>
      <VStack align="center" justify="center">
        <StackItem>
          <Icon source={ErrorTriangleFilledIcon} size={IconSize.L} color="txt-black-darkest" />
        </StackItem>
        <StackItem marginBefore={4}>
          <Text typo={Typography.Size15} color="txt-black-darkest">
            {i18ntext('Oops, we failed to load.')}
          </Text>
        </StackItem>
        <StackItem>
          <Text typo={Typography.Size12} color="txt-black-darker">
            {i18ntext('This is not the page you are looking for.')}
          </Text>
        </StackItem>
      </VStack>
    </Sized>
  );
}
