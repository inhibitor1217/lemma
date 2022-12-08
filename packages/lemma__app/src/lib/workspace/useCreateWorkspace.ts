import { go, IO, pipe, Task } from '@lemma/fx';
import { useQueryClient } from '@tanstack/react-query';
import { Error } from '~/lib/error';
import { i18nstring } from '~/lib/i18n';
import { useParametricMutation } from '~/lib/react-query';
import { useToastService } from '~/lib/toast';
import { WorkspaceHttpApi, WorkspaceHttpApi__Resolver, WorkspaceHttpApi__RQ } from './http-api';
import { Workspace } from './workspace';

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
  const toastService = useToastService();

  const showWorkspaceCreateSuccessToast =
    (workspace: Workspace): IO<void> =>
    () =>
      toastService.success(i18nstring(`Workspace "${workspace.profile?.displayName}" has been created.`));

  const showWorkspaceCreateErrorToast =
    (error: Error): IO<void> =>
    () =>
      toastService.error(error.message);

  const onSuccess = showWorkspaceCreateSuccessToast;

  const onError = showWorkspaceCreateErrorToast;

  return useParametricMutation(createWorkspaceKey, createWorkspace, {
    onMutate: () => go(() => queryClient.invalidateQueries(WorkspaceHttpApi__RQ.getWorkspaces), IO.run),
    onSuccess: pipe(onSuccess, IO.run),
    onError: pipe(onError, IO.run),
  });
}
