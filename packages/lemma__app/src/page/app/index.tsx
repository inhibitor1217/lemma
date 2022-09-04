import { Navigate } from 'react-router-dom';
import { AuthorizePage } from '~/feature/auth';
import { withAuth } from '~/lib/auth';
import { Disconnected, Error, ErrorSemantic, Unknown } from '~/lib/error';
import { text } from '~/lib/i18n';
import { Center } from '~/lib/layout';
import { FullscreenPage } from '~/lib/page-template';
import { Text, Typography } from '~/lib/typography';
import { InternalPath } from '../path';

function App() {
  return <div />;
}

function AppLoading() {
  return (
    <FullscreenPage>
      <Center>
        <Text as="h3" typo={Typography.Size18} color="txt-black-darker">
          {text('Loading ...')}
        </Text>
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
          'redirect-to': InternalPath.App,
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
