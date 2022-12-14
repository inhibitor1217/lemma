import { Navigate } from 'react-router-dom';
import { AuthorizePage } from '~/feature/auth';
import { Disconnected, Error, ErrorSemantic, InvalidEntity, Unknown } from '~/lib/error';
import { Center } from '~/lib/layout';
import { FullscreenPage } from '~/lib/page-template';
import { InternalPath } from '../path';

export function AppLoading() {
  return <FullscreenPage.Loading />;
}

export function AppError({ error }: { error: Error }) {
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
        to={InternalPath.Authorize._query({
          reason: AuthorizePage.AuthorizeFailedReason.NoSession,
          'redirect-to': InternalPath.App._,
        })}
      />
    );
  }

  if (Error.isSemanticOf(error, ErrorSemantic.InvalidEntity)) {
    return (
      <FullscreenPage>
        <Center>
          <InvalidEntity />
        </Center>
      </FullscreenPage>
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
