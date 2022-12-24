export class UnknownError extends Error {
  constructor(readonly raw: unknown) {
    super(`UnknownError`);
  }
}
