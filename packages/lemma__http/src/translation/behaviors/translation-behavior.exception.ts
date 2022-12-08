export class DuplicateTranslationKeyException extends Error {
  constructor(public readonly key: string) {
    super(`Translation with key '${key}' already exists`);
  }
}

export class TranslationNotFoundException extends Error {
  constructor(public readonly translationId: string) {
    super(`Translation with id '${translationId}' not found`);
  }
}
