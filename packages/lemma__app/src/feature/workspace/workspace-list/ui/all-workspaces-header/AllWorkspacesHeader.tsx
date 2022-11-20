import { HStack, StackItem } from '~/lib/layout';
import AddWorkspaceButton from './AddWorkspaceButton';
import AllWorkspacesTitle from './AllWorkspacesTitle';

export default function AllWorkspacesHeader({ addWorkspace }: { addWorkspace: () => void }) {
  return (
    <HStack spacing={30}>
      <StackItem grow shrink weight={1}>
        <AllWorkspacesTitle />
      </StackItem>

      <StackItem>
        <AddWorkspaceButton addWorkspace={addWorkspace} />
      </StackItem>
    </HStack>
  );
}
