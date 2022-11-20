import { useCallback } from 'react';
import { Array, go, Option, pipe, Struct, Task } from '~/lib/fx';
import { Divider, StackItem, VStack } from '~/lib/layout';
import { HttpApiOffsetPagination } from '~/lib/net/http-api';
import { usePaginatedQuery } from '~/lib/react-query';
import { WorkspaceHttpApi, WorkspaceHttpApi__Resolver, WorkspaceHttpApi__RQ } from '~/lib/workspace';
import { AllWorkspacesHeader } from './ui/all-workspaces-header';
import {
  EmptyWorkspaceList,
  LoadMoreWorkspaces,
  WorkspaceGrid,
  WorkspaceListError,
  WorkspaceListNextPageSkeleton,
  WorkspaceListSkeleton,
} from './ui/paginated-list';
import WorkspaceCard from './WorkspaceCard';

const getPaginatedWorkspaces = (page: number) =>
  go(
    () => WorkspaceHttpApi.getWorkspaces({ page: Option.some(page) }),
    Task.mapLeft(
      pipe(
        Struct.pick('workspaces'),
        HttpApiOffsetPagination.resolve(WorkspaceHttpApi__Resolver.Workspace.fromGetWorkspacesResultDTO)
      )
    )
  );

function useWorkspaces() {
  return usePaginatedQuery(WorkspaceHttpApi__RQ.getWorkspaces, getPaginatedWorkspaces);
}

function useAddWorkspace() {
  // @todo
  return useCallback(() => {}, []);
}

function WorkspaceList() {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useWorkspaces();
  const addWorkspace = useAddWorkspace();

  if (isLoading) {
    return <WorkspaceListSkeleton />;
  }

  if (isError) {
    return <WorkspaceListError />;
  }

  if (data.pages.length === 0) {
    return <EmptyWorkspaceList addWorkspace={addWorkspace} />;
  }

  return (
    <WorkspaceGrid>
      {go(
        data.pages,
        Array.flatMap((page) => page.items),
        Array.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} />)
      )}

      {hasNextPage && !isFetchingNextPage && <LoadMoreWorkspaces loadMoreWorkspaces={fetchNextPage} />}

      {isFetchingNextPage && <WorkspaceListNextPageSkeleton />}
    </WorkspaceGrid>
  );
}

export default function AllWorkspaces() {
  const addWorkspace = useAddWorkspace();

  return (
    <VStack spacing={16} align="stretch">
      <StackItem>
        <AllWorkspacesHeader addWorkspace={addWorkspace} />
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
