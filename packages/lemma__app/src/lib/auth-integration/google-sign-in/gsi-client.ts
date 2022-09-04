/**
 * Implementation of Google Sign-In JavaScript API.
 *
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference
 */
export namespace GoogleSignInClient {
  export type CredentialResponse = {
    credential: string;
    select_by:
      | 'auto'
      | 'user'
      | 'user_1tap'
      | 'user_2tap'
      | 'btn'
      | 'btn_confirm'
      | 'btn_add_session'
      | 'btn_confirm_add_session';
  };

  export type Credential = {
    id: string;
    password: string;
  };

  /**
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
   */
  export type IdConfiguration = {
    client_id: string;
    auto_select?: boolean;
    callback?: (response: CredentialResponse) => void;
    login_uri?: string;
    native_callback?: (response: Credential) => void;
    cancel_on_tap_outside?: boolean;
    prompt_parent_id?: string;
    nonce?: string;
    context?: 'signin' | 'signup' | 'use';
    state_cookie_domain?: string;
    ux_mode?: 'popup' | 'redirect';
    allowed_parent_origin?: string | string[];
    intermediate_iframe_close_callback?: () => void;
    itp_support?: boolean;
  };

  /**
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification
   */
  export type PromptMomentNotification = {
    isDisplayMoment(): boolean;
    isDisplayed(): boolean;
    isNotDisplayed(): boolean;
    getNotDisplayedReason():
      | 'browser_not_supported'
      | 'invalid_client'
      | 'missing_client_id'
      | 'opt_out_or_no_session'
      | 'secure_http_required'
      | 'suppressed_by_user'
      | 'unregistered_origin'
      | 'unknown_reason';
    isSkippedMoment(): boolean;
    getSkippedReason(): 'auto_cancel' | 'user_cancel' | 'tap_outside' | 'issuing_failed';
    isDismissedMoment(): boolean;
    getDismissedReason(): 'credential_returned' | 'cancel_called' | 'flow_restarted';
    getMomentType(): 'display' | 'skipped' | 'dismissed';
  };

  /**
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration
   */
  export type GsiButtonConfiguration = {
    type: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
    locale?: string;
  };

  /**
   * @see https://developers.google.com/identity/gsi/web/reference/js-reference#RevocationResponse
   */
  export type RevocationResponse = {
    successful: boolean;
    error?: string;
  };

  const warnMissingGsiClient = () => console.warn('GSI client is not available. Did you forget to load the GSI script?');

  const guardGsiClient =
    <Args extends any[]>(getFn: () => (...args: Args) => void): ((...args: Args) => void) =>
    (...args: Args) => {
      if (!window.google) {
        warnMissingGsiClient();
        return;
      }

      return getFn()(...args);
    };

  export const initialize = guardGsiClient(() => window.google!.accounts.id.initialize);
  export const prompt = guardGsiClient(() => window.google!.accounts.id.prompt);
  export const renderButton = guardGsiClient(() => window.google!.accounts.id.renderButton);
  export const disableAutoSelect = guardGsiClient(() => window.google!.accounts.id.disableAutoSelect);
  export const storeCredential = guardGsiClient(() => window.google!.accounts.id.storeCredential);
  export const cancel = guardGsiClient(() => window.google!.accounts.id.cancel);
  export const revoke = guardGsiClient(() => window.google!.accounts.id.revoke);
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleSignInClient.IdConfiguration) => void;
          prompt: (callback?: (notification: GoogleSignInClient.PromptMomentNotification) => void) => void;
          renderButton: (parent: HTMLElement, options: GoogleSignInClient.GsiButtonConfiguration) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: GoogleSignInClient.Credential, callback: () => void) => void;
          cancel: () => void;
          revoke: (hint: string, callback: (response: GoogleSignInClient.RevocationResponse) => void) => void;
        };
      };
    };

    onGoogleLibraryLoad?: () => void;
  }
}
