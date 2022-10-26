import { asDefaultExport, lazyComponent } from '~/lib/dynamic-import';
import { Center } from '~/lib/layout';
import { FullscreenPage } from '~/lib/page-template';

const AuthorizeForm = lazyComponent(
  () => import('~/feature/auth').then(asDefaultExport('AuthorizeForm')),
  <FullscreenPage.Loading />
);

export default function Authorize() {
  return (
    <FullscreenPage>
      <Center>
        <AuthorizeForm />
      </Center>
    </FullscreenPage>
  );
}
