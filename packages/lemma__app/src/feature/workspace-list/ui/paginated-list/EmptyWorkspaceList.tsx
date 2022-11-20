import { styled } from '@channel.io/bezier-react';
import { i18ntext } from '~/lib/i18n';
import { Padding, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

const Description = styled(Text).attrs({
  typo: Typography.Size15,
  color: 'txt-black-darker',
})``;

const AddWorkspaceLink = styled(Text).attrs({
  typo: Typography.Size13,
  color: 'txt-black-dark',
  underline: true,
})`
  cursor: pointer;
`;

export default function EmptyWorkspaceList({ addWorkspace }: { addWorkspace: () => void }) {
  return (
    <Padding equal={32}>
      <VStack spacing={16} align="center">
        <StackItem>
          <Description>{i18ntext('There are no workspaces yet! Create a new workspace to start a project.')}</Description>
        </StackItem>

        <StackItem>
          <AddWorkspaceLink onClick={addWorkspace}>{i18ntext('Start a new project')}</AddWorkspaceLink>
        </StackItem>
      </VStack>
    </Padding>
  );
}
