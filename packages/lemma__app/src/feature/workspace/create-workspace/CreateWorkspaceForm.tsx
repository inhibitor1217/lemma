import { StackItem, VStack } from '~/lib/layout';
import { useCreateWorkspace } from '~/lib/workspace';
import { CreateWorkspaceFormProvider, DisplayNameField, SlugField, SubmitButton } from './form';
import { CreateWorkspaceFormTitle } from './ui';

export default function CreateWorkspaceForm() {
  const { mutateAsync: createWorkspace } = useCreateWorkspace();

  return (
    <CreateWorkspaceFormProvider createWorkspace={createWorkspace}>
      <VStack spacing={16} justify="center">
        <StackItem marginAfter={32}>
          <CreateWorkspaceFormTitle />
        </StackItem>

        <StackItem>
          <SlugField />
        </StackItem>

        <StackItem>
          <DisplayNameField />
        </StackItem>

        <StackItem marginBefore={48}>
          <SubmitButton />
        </StackItem>
      </VStack>
    </CreateWorkspaceFormProvider>
  );
}
