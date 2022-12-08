export class DuplicateTranslationKeyException extends Error {
  constructor(public readonly key: string) {
    super('DuplicateTranslationKeyException');
  }
}

export class TranslationNotFoundException extends Error {
  constructor(public readonly translationId: string) {
    super('TranslationNotFoundException');
  }
}
