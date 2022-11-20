import { go, Option, pipe, Struct, Task } from '~/lib/fx';
import { HttpApiOffsetPagination } from '~/lib/net/http-api';
import { usePaginatedQuery } from '~/lib/react-query';
import { WorkspaceHttpApi, WorkspaceHttpApi__Resolver, WorkspaceHttpApi__RQ } from '~/lib/workspace';

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

export function useWorkspaces() {
  return usePaginatedQuery(WorkspaceHttpApi__RQ.getWorkspaces, getPaginatedWorkspaces);
}
