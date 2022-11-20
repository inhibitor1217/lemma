import { i18ntext } from '~/lib/i18n';
import { Padding, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

export default function EmptyWorkspaceList({ addWorkspace }: { addWorkspace: () => void }) {
  return (
    <Padding equal={32}>
      <VStack spacing={16} align="center">
        <StackItem>
          <Text typo={Typography.Size15} color="txt-black-darker">
            {i18ntext('There are no workspaces yet! Create a new workspace to start a project.')}
          </Text>
        </StackItem>

        <StackItem>
          <Text typo={Typography.Size13} color="txt-black-dark" underline onClick={addWorkspace}>
            {i18ntext('Start a new project')}
          </Text>
        </StackItem>
      </VStack>
    </Padding>
  );
}
