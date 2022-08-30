import { Env } from '~/lib/env';
import { StackItem, VStack } from '~/lib/layout';
import { HttpApi } from '~/lib/net';

function GoogleIdentitySignInButton() {
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={Env.googleOauthClientId}
        data-login_uri={HttpApi.url('/auth/google')}
        data-auto_prompt="false"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      />
    </>
  );
}

export default function AuthorizeMethods() {
  return (
    <VStack spacing={8}>
      <StackItem>
        <GoogleIdentitySignInButton />
      </StackItem>
    </VStack>
  );
}
