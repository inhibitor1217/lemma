import { Spinner } from '@channel.io/bezier-react';
import { Navigate } from 'react-router-dom';
import { AuthorizePage } from '~/feature/auth';
import { Disconnected, Error, ErrorSemantic, Unknown } from '~/lib/error';
import { Center } from '~/lib/layout';
import { FullscreenPage } from '~/lib/page-template';
import { InternalPath } from '../path';

export function AppLoading() {
  return (
    <FullscreenPage>
      <Center>
        <Spinner color="txt-black-dark" />
      </Center>
    </FullscreenPage>
  );
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

  return (
    <FullscreenPage>
      <Center>
        <Unknown />
      </Center>
    </FullscreenPage>
  );
}
