import { HStack, StackItem } from '~/lib/layout';
import CreateWorkspaceButton from './CreateWorkspaceButton';
import AllWorkspacesTitle from './AllWorkspacesTitle';

export default function AllWorkspacesHeader({ createWorkspace }: { createWorkspace: () => void }) {
  return (
    <HStack spacing={30}>
      <StackItem grow shrink weight={1}>
        <AllWorkspacesTitle />
      </StackItem>

      <StackItem>
        <CreateWorkspaceButton createWorkspace={createWorkspace} />
      </StackItem>
    </HStack>
  );
}
