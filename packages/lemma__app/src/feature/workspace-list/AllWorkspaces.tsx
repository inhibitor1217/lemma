import { Button, ButtonSize, Icon, IconSize, PlusIcon } from '@channel.io/bezier-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, Skeleton } from '~/lib/component';
import { Unknown } from '~/lib/error';
import { Array, go, Option } from '~/lib/fx';
import { i18nstring, i18ntext } from '~/lib/i18n';
import { Center, Divider, Grid, HStack, Padding, StackItem, VStack } from '~/lib/layout';
import { RQuery } from '~/lib/react-query';
import { Text, Typography } from '~/lib/typography';
import { WorkspaceHttpApi, WorkspaceHttpApi__Resolver, WorkspaceHttpApi__RQ } from '~/lib/workspace';
import WorkspaceCard from './WorkspaceCard';

function AllWorkspacesTitle() {
  return (
    <Text as="h1" typo={Typography.Size24} bold color="txt-black-darkest">
      {i18ntext('All workspaces')}
    </Text>
  );
}

function AddWorkspaceButton() {
  // @todo
  return (
    <Link to=".">
      <Button size={ButtonSize.L} leftContent="plus" text={i18nstring('Add workspace')} />
    </Link>
  );
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
          {/* @todo */}
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

function LoadMoreWorkspaces({ onLoadMore }: { onLoadMore: () => void }) {
  return (
    <Card.Interactive onClick={onLoadMore}>
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

function useWorkspaces() {
  return useInfiniteQuery(
    WorkspaceHttpApi__RQ.getWorkspaces,
    ({ pageParam: page }) => WorkspaceHttpApi.getWorkspaces({ page: Option.some(page) }),
    {
      ...RQuery.InfiniteQuery.fromPaginatedApi('workspaces'),
    }
  );
}

function WorkspaceList() {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useWorkspaces();

  if (isLoading) {
    return (
      <Grid.Responsive
        numColumns={{
          medium: 3,
          small: 2,
          xsmall: 1,
        }}
        rowHeight={160}
      >
        <Card.Static>
          <Skeleton.Profile />
        </Card.Static>

        <Card.Static>
          <Skeleton.Profile />
        </Card.Static>

        <Card.Static>
          <Skeleton.Profile />
        </Card.Static>
      </Grid.Responsive>
    );
  }

  if (isError) {
    return (
      <Center>
        <Unknown />
      </Center>
    );
  }

  return (
    <Grid.Responsive
      numColumns={{
        medium: 3,
        small: 2,
        xsmall: 1,
      }}
      rowHeight={160}
    >
      {go(
        data.pages,
        Array.flatMap((page) => page.workspaces.items),
        Array.map(WorkspaceHttpApi__Resolver.Workspace.fromGetWorkspacesResultDTO),
        Array.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} />)
      )}

      {hasNextPage && !isFetchingNextPage && <LoadMoreWorkspaces onLoadMore={fetchNextPage} />}

      {isFetchingNextPage && (
        <Card.Static>
          <Skeleton.Profile />
        </Card.Static>
      )}
    </Grid.Responsive>
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
        <WorkspaceList />
      </StackItem>
    </VStack>
  );
}
