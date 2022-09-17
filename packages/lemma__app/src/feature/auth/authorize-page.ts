export namespace AuthorizePage {
  export enum AuthorizeFailedReason {
    NoSession = 'no-session',
    SignOut = 'sign-out',
  }

  export type QueryParams = {
    reason?: AuthorizeFailedReason;
    'redirect-to'?: string;
  };
}
