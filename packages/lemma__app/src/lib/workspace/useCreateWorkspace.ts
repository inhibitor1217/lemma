import { useQueryClient } from '@tanstack/react-query';
import { go, IO, Task } from '~/lib/fx';
import { useParametricMutation } from '~/lib/react-query';
import { WorkspaceHttpApi, WorkspaceHttpApi__Resolver, WorkspaceHttpApi__RQ } from './http-api';

/**
 * Regard empty display name as a default value.
 */
const sanitizeDisplayName = (displayName: string): string | undefined => {
  if (displayName.length === 0) {
    return undefined;
  }

  return displayName;
};

const createWorkspaceKey = WorkspaceHttpApi__RQ.createWorkspace;
const createWorkspace = (form: { slug: string; displayName: string }) =>
  go(
    () =>
      WorkspaceHttpApi.createWorkspace({
        slug: form.slug,
        displayName: sanitizeDisplayName(form.displayName),
      }),
    Task.mapLeft(WorkspaceHttpApi__Resolver.fromCreateWorkspaceResultDTO)
  );

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useParametricMutation(createWorkspaceKey, createWorkspace, {
    onMutate: () => go(() => queryClient.invalidateQueries(WorkspaceHttpApi__RQ.getWorkspaces), IO.run),
  });
}
