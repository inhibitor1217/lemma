import { Spinner } from '@channel.io/bezier-react';
import { Navigate } from 'react-router-dom';
import { AuthorizePage } from '~/feature/auth';
import { withAuth } from '~/lib/auth';
import { Disconnected, Error, ErrorSemantic, Unknown } from '~/lib/error';
import { Center } from '~/lib/layout';
import { FullscreenPage, HierarchicalPage } from '~/lib/page-template';
import { InternalPath } from '../path';

function App() {
  return <HierarchicalPage.EmptyPage />;
}

function AppLoading() {
  return (
    <FullscreenPage>
      <Center>
        <Spinner color="txt-black-dark" />
      </Center>
    </FullscreenPage>
  );
}

function AppError({ error }: { error: Error }) {
  if (Error.isSemanticOf(error, ErrorSemantic.Disconnected)) {
    return (
      <FullscreenPage>
        <Center>
          <Disconnected />
        </Center>
      </FullscreenPage>
    );
  }

  if (Error.isSemanticOf(error, ErrorSemantic.Unauthorized)) {
    return (
      <Navigate
        to={InternalPath.Authorize.query({
          reason: AuthorizePage.AuthorizeFailedReason.NoSession,
          'redirect-to': InternalPath.App._,
        })}
      />
    );
  }

  return (
    <FullscreenPage>
      <Center>
        <Unknown />
      </Center>
    </FullscreenPage>
  );
}

export default withAuth(App, {
  Loading: AppLoading,
  Error: AppError,
});