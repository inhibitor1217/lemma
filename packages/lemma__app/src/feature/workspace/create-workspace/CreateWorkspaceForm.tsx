import { StackItem, VStack } from '~/lib/layout';
import { CreateWorkspaceFormProvider, DisplayNameField, SlugField, SubmitButton } from './form';
import { CreateWorkspaceFormTitle } from './ui';

export default function CreateWorkspaceForm() {
  return (
    <CreateWorkspaceFormProvider createWorkspace={() => new Promise((resolve) => setTimeout(resolve, 1000))}>
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
