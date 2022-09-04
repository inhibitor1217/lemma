import { useMemo } from 'react';
import { Env } from '~/lib/env';
import { StackItem, VStack } from '~/lib/layout';
import { HttpApi } from '~/lib/net/http-api';
import { useSearchParams } from '~/lib/net/url';
import { AuthorizePage } from './authorize-page';

function GoogleIdentitySignInButton() {
  const [params] = useSearchParams<AuthorizePage.QueryParams>();

  const loginCallbackUri = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (params['redirect-to']) {
      searchParams.set('redirect_to', params['redirect-to']);
    }
    return HttpApi.url('/auth/google/ids', searchParams);
  }, [params]);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={Env.googleOauthClientId}
        data-login_uri={loginCallbackUri}
        data-auto_prompt="true"
        data-auto_select="true"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-theme="outline"
        data-text="continue_with"
        data-size="large"
        data-shape="pill"
        data-width="300"
        data-logo_alignment="left"
      />
    </>
  );
}

export default function AuthorizeMethods() {
  return (
    <VStack spacing={8} align="center">
      <StackItem>
        <GoogleIdentitySignInButton />
      </StackItem>
    </VStack>
  );
}
