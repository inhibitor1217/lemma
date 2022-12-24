import { defineException } from '@lemma/exception';

export const DuplicateTranslationKeyException = defineException('TranslationBehavior', 'DuplicateTranslationKeyException')<{
  key: string;
}>();
export type DuplicateTranslationKeyException = InstanceType<typeof DuplicateTranslationKeyException>;

export const TranslationNotFoundException = defineException('TranslationBehavior', 'TranslationNotFoundException')<{
  translationId: string;
}>();
export type TranslationNotFoundException = InstanceType<typeof TranslationNotFoundException>;
