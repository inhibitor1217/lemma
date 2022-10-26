import { Button, ButtonSize } from '@channel.io/bezier-react';
import { Link } from 'react-router-dom';
import { i18nstring, i18ntext } from '~/lib/i18n';
import { Divider, HStack, Padding, StackItem, VStack } from '~/lib/layout';
import { Text, Typography } from '~/lib/typography';

function AllWorkspacesTitle() {
  return (
    <Text as="h1" typo={Typography.Size24} bold color="txt-black-darkest">
      {i18ntext('All Lemma workspaces')}
    </Text>
  );
}

function AddWorkspaceButton() {
  return <Button size={ButtonSize.L} leftContent="plus" text={i18nstring('Add workspace')} />;
}

function AllWorkspacesHeader() {
  return (
    <HStack spacing={30}>
      <StackItem grow shrink weight={1}>
        <AllWorkspacesTitle />
      </StackItem>

      <StackItem>
        <AddWorkspaceButton />
      </StackItem>
    </HStack>
  );
}

function EmptyWorkspaceList() {
  return (
    <Padding equal={32}>
      <VStack spacing={16} align="center">
        <StackItem>
          <Text typo={Typography.Size15} color="txt-black-darker">
            {i18ntext('There are no workspaces yet! Create a new workspace to start a project.')}
          </Text>
        </StackItem>

        <StackItem>
          <Link to=".">
            <Text typo={Typography.Size13} color="txt-black-dark" underline>
              {i18ntext('Start a new project')}
            </Text>
          </Link>
        </StackItem>
      </VStack>
    </Padding>
  );
}

export default function AllWorkspaces() {
  return (
    <VStack spacing={16} align="stretch">
      <StackItem>
        <AllWorkspacesHeader />
      </StackItem>

      <StackItem>
        <Divider orientation="horizontal" />
      </StackItem>

      <StackItem>
        <EmptyWorkspaceList />
      </StackItem>
    </VStack>
  );
}
