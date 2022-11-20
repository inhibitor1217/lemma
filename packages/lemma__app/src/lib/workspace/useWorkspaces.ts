import { go, Option, Task } from '~/lib/fx';
import { usePaginatedQuery } from '~/lib/react-query';
import { WorkspaceHttpApi, WorkspaceHttpApi__Resolver, WorkspaceHttpApi__RQ } from '~/lib/workspace';

const getPaginatedWorkspacesKey = WorkspaceHttpApi__RQ.getWorkspaces;
const getPaginatedWorkspaces = (page: number) =>
  go(
    () => WorkspaceHttpApi.getWorkspaces({ page: Option.some(page) }),
    Task.mapLeft(WorkspaceHttpApi__Resolver.fromGetWorkspacesResultDTO)
  );

export function useWorkspaces() {
  return usePaginatedQuery(getPaginatedWorkspacesKey, getPaginatedWorkspaces);
}
