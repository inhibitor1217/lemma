import { Array, go } from '~/lib/fx';
import { Divider, StackItem, VStack } from '~/lib/layout';
import { useAddWorkspace, useWorkspaces } from '~/lib/workspace';
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
