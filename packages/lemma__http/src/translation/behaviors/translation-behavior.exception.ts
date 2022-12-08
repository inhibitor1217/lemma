export class DuplicateTranslationKeyException extends Error {
  constructor(key: string) {
    super(`Translation with key '${key}' already exists`);
  }
}
