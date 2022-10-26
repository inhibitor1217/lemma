import { StackItem, VStack } from '~/lib/layout';
import AllWorkspaces from './AllWorkspaces';

export default function WorkspaceList() {
  return (
    <VStack align="stretch">
      <StackItem>
        <AllWorkspaces />
      </StackItem>
    </VStack>
  );
}
