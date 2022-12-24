import { defineException } from '@lemma/exception';

export const InvalidFileMIMETypeException = defineException('TranslationsImportBehavior', 'InvalidFileMIMETypeException')<{
  mimetype: string;
  expectedMimeType: string;
}>();
export type InvalidFileMIMETypeException = InstanceType<typeof InvalidFileMIMETypeException>;
