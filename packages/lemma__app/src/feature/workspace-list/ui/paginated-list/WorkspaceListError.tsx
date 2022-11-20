import { Error, ErrorView } from '~/lib/error';
import { Center } from '~/lib/layout';

export default function WorkspaceListError({ error }: { error: Error }) {
  return (
    <Center>
      <ErrorView error={error} />
    </Center>
  );
}
