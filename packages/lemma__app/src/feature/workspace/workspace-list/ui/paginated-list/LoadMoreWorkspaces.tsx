import { Icon, IconSize, PlusIcon } from '@channel.io/bezier-react';
import { Card } from '~/lib/component';
import { i18ntext } from '~/lib/i18n';
import { HStack, StackItem } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

export default function LoadMoreWorkspaces({ loadMoreWorkspaces }: { loadMoreWorkspaces: () => void }) {
  return (
    <Card.Interactive onClick={loadMoreWorkspaces}>
      <HStack justify="center" align="center" spacing={8}>
        <StackItem style={{ height: IconSize.S }}>
          <Icon size={IconSize.S} source={PlusIcon} color="txt-black-darker" />
        </StackItem>

        <StackItem>
          <Text typo={Typography.Size16} color="txt-black-darker">
            {i18ntext('Load more workspaces')}
          </Text>
        </StackItem>
      </HStack>
    </Card.Interactive>
  );
}
