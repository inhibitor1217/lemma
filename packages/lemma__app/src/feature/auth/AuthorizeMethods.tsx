import { Env } from '~/lib/env';
import { StackItem, VStack } from '~/lib/layout';
import { HttpApi } from '~/lib/net';

function GoogleIdentitySignInButton() {
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={Env.googleOauthClientId}
        data-login_uri={HttpApi.url('/auth/gidc')}
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
