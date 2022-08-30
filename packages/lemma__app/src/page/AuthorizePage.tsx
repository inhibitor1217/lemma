import { AuthorizeForm } from '~/feature/auth';
import { Center } from '~/lib/layout';
import { FullscreenPage } from '~/lib/page-template';

export default function AuthorizePage() {
  return (
    <FullscreenPage>
      <Center>
        <AuthorizeForm />
      </Center>
    </FullscreenPage>
  );
}
