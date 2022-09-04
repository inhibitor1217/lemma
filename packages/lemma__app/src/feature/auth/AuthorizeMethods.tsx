import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleSignIn } from '~/lib/auth-integration/google-sign-in';
import { StackItem, VStack } from '~/lib/layout';
import { useSearchParams } from '~/lib/net/url';
import { InternalPath } from '~/page';
import { AuthorizePage } from './authorize-page';

function GoogleIdentitySignInButton() {
  const navigate = useNavigate();
  const [params] = useSearchParams<AuthorizePage.QueryParams>();
  const ref = useRef<HTMLDivElement>(null);

  const redirectOnSignInSuccess = useCallback(
    () => navigate(params['redirect-to'] ?? InternalPath.App),
    [navigate, params['redirect-to']]
  );

  useEffect(
    function renderGoogleSignInButton() {
      GoogleSignIn.initialize({
        auto_select: true,
        callback: redirectOnSignInSuccess,
      });

      if (ref.current) {
        GoogleSignIn.renderButton(ref.current, {
          type: 'standard',
          theme: 'outline',
          text: 'continue_with',
          size: 'large',
          shape: 'pill',
          width: '300',
          logo_alignment: 'left',
        });
      }

      GoogleSignIn.prompt();

      return function cleanup() {
        GoogleSignIn.cancel();
      };
    },
    [redirectOnSignInSuccess]
  );

  return <div ref={ref} />;
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
