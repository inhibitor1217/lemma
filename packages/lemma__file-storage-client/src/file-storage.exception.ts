export class NoSuchKeyException extends Error {
  constructor(readonly key: string) {
    super(`NoSuchKeyException`);
  }
}
