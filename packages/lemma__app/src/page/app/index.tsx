import { Navigate } from 'react-router-dom';
import { withAuth } from '~/lib/auth';
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

export default withAuth(App, {
  Loading: AppLoading,
  Error: () => <Navigate to={InternalPath.Authorize} />,
});
