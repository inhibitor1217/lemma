import cookie from 'js-cookie';
import { useSyncExternalStore } from 'react';
import { AuthHttpApi } from '~/lib/auth/http-api';
import { Env } from '~/lib/env';
import { GoogleSignInClient } from './gsi-client';

/**
 * Abstraction over the Google Sign-In API,
 * using `GoogleSignInClient` as the implementation.
 */
export namespace GoogleSignIn {
  export type Configuration = {
    auto_select: boolean;
    callback: () => void;
  };

  export type ButtonConfiguration = GoogleSignInClient.GsiButtonConfiguration;

  const nonce = (): string => {
    const randomBytes = window.crypto.getRandomValues(new Uint32Array(2));
    return randomBytes[0].toString(16) + randomBytes[1].toString(16);
  };

  /**
   * @note
   *
   * Uses 'popup' UX mode of the Google Sign-In flow.
   */
  export const initialize = (config: Configuration): void => {
    const csrfToken = nonce();

    cookie.set('g_csrf_token', csrfToken, { path: '/', secure: Env.mode !== 'development', sameSite: 'Lax' });

    GoogleSignInClient.initialize({
      client_id: Env.googleOauthClientId,
      ux_mode: 'popup',
      nonce: csrfToken,
      callback: (response) =>
        AuthHttpApi.signInWithGoogle({
          credential: response.credential,
          csrfToken,
        }).then(config.callback),
      auto_select: config.auto_select,
    });
  };

  export const renderButton = GoogleSignInClient.renderButton;

  export const prompt = GoogleSignInClient.prompt;

  export const cancel = GoogleSignInClient.cancel;

  export const signOut = () => {
    GoogleSignInClient.disableAutoSelect();
  };

  const _gsiScriptListeners = new Set<() => void>();
  let _gsiScriptLoaded = false;

  window.onGoogleLibraryLoad = () => {
    console.debug('[lib:auth-integration:GoogleSignIn]', 'Google Sign-In library loaded.');
    _gsiScriptLoaded = true;
    _gsiScriptListeners.forEach((listener) => listener());
  };

  export function useGoogleSignInAvailable(): boolean {
    return useSyncExternalStore(
      (subscribe) => {
        _gsiScriptListeners.add(subscribe);
        return () => _gsiScriptListeners.delete(subscribe);
      },
      () => _gsiScriptLoaded
    );
  }
}
