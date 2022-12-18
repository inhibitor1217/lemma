export class MissingCredentialsException extends Error {
  constructor() {
    super(`MissingCredentialsException`);
  }
}

export class NoSuchKeyException extends Error {
  constructor() {
    super(`NoSuchKeyException`);
  }
}

export class UnknownError extends Error {
  constructor(readonly raw: unknown) {
    super(`UnknownError`);
  }
}
