export namespace AuthorizePage {
  export enum AuthorizeFailedReason {
    NoSession = 'no-session',
  }

  export type QueryParams = {
    reason?: AuthorizeFailedReason;
    'redirect-to'?: string;
  };
}
