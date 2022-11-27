import { IO } from '~/lib/fx';
import { StackItem, VStack } from '~/lib/layout';
import { useCreateWorkspace, useWorkspaceRoute, Workspace } from '~/lib/workspace';
import { CreateWorkspaceFormProvider, CreateWorkspaceFormValues, DisplayNameField, SlugField, SubmitButton } from './form';
import { CreateWorkspaceFormTitle } from './ui';

export default function CreateWorkspaceForm() {
  const { mutateAsync: createWorkspace } = useCreateWorkspace();

  const routeToWorkspace = useWorkspaceRoute();

  const onCreateWorkspaceSuccess = (workspace: Workspace) => routeToWorkspace(workspace.id);

  const handleCreateWorkspace = (values: CreateWorkspaceFormValues) =>
    createWorkspace(values).then((workspace) => {
      IO.run(onCreateWorkspaceSuccess(workspace));
      return workspace;
    });

  return (
    <CreateWorkspaceFormProvider createWorkspace={handleCreateWorkspace}>
      <VStack spacing={16} justify="center">
        <StackItem marginAfter={32}>
          <CreateWorkspaceFormTitle />
        </StackItem>

        <StackItem style={{ width: 480 }}>
          <SlugField />
        </StackItem>

        <StackItem style={{ width: 480 }}>
          <DisplayNameField />
        </StackItem>

        <StackItem marginBefore={48}>
          <SubmitButton />
        </StackItem>
      </VStack>
    </CreateWorkspaceFormProvider>
  );
}
