export class MissingCredentialsException extends Error {
  constructor() {
    super(`MissingCredentialsException`);
  }
}

export class UnknownError extends Error {
  constructor(readonly raw: unknown) {
    super(`UnknownError`);
  }
}
