import { Array, go } from '~/lib/fx';
import { Divider, StackItem, VStack } from '~/lib/layout';
import { useCreateWorkspaceRoute, useWorkspaces } from '~/lib/workspace';
import { AllWorkspacesHeader } from './ui/all-workspaces-header';
import {
  EmptyWorkspaceList,
  LoadMoreWorkspaces,
  WorkspaceGrid,
  WorkspaceListError,
  WorkspaceListNextPageSkeleton,
  WorkspaceSkeleton,
} from './ui/paginated-list';
import WorkspaceCard from './WorkspaceCard';

function WorkspaceList() {
  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useWorkspaces();
  const createWorkspaceRoute = useCreateWorkspaceRoute();

  if (isLoading) {
    return (
      <WorkspaceGrid>
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
      </WorkspaceGrid>
    );
  }

  if (isError) {
    return <WorkspaceListError error={error} />;
  }

  const workspaces = go(
    data.pages,
    Array.flatMap((page) => page.items)
  );

  if (workspaces.length === 0) {
    return <EmptyWorkspaceList createWorkspace={createWorkspaceRoute} />;
  }

  return (
    <WorkspaceGrid>
      {go(
        workspaces,
        Array.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} />)
      )}

      {hasNextPage && !isFetchingNextPage && <LoadMoreWorkspaces loadMoreWorkspaces={fetchNextPage} />}

      {isFetchingNextPage && <WorkspaceListNextPageSkeleton />}
    </WorkspaceGrid>
  );
}

export default function AllWorkspaces() {
  const createWorkspaceRoute = useCreateWorkspaceRoute();

  return (
    <VStack spacing={16} align="stretch">
      <StackItem>
        <AllWorkspacesHeader createWorkspace={createWorkspaceRoute} />
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
