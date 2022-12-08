export class DuplicateTranslationKeyException extends Error {
  constructor(public readonly key: string) {
    super('DuplicateTranslationKeyException');
  }
}
