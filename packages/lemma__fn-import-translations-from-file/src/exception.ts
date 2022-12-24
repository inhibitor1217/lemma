import { defineException } from '@lemma/exception';

export const TranslationsFileNotFoundException = defineException(
  'FnImportTranslationsFromFile',
  'TranslationsFileNotFoundException'
)<{}>();
