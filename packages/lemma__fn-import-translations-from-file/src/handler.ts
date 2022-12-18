import { AWSS3Client, AWSS3ClientArgs } from '@lemma/aws-s3';
import { FileStorageClient, FileStorageLocation } from '@lemma/file-storage-client';
import { Handler } from 'aws-lambda';
import { Event, Result } from './types';

const s3 = new AWSS3Client(
  process.env.STAGE === 'dev'
    ? AWSS3ClientArgs.customEndpoint({
        endpoint: process.env.AWS_ENDPOINT || '',
        region: process.env.AWS_REGION || '',
        resourcePrefix: process.env.AWS_RESOURCE_PREFIX || '',
        logger: console,
      })
    : AWSS3ClientArgs.region({
        resourcePrefix: process.env.AWS_RESOURCE_PREFIX || '',
        region: process.env.AWS_REGION || '',
        logger: console,
      })
);

const fileStorage = new FileStorageClient(s3);

class TranslationsFileNotFoundException extends Error {
  constructor() {
    super('TranslationsFileNotFoundException');
  }
}

export const handler: Handler<Event, Result> = async (event, context) => {
  const {
    payload: {
      workspaceId,
      translationsImportAttemptId,
      file: { type, key },
      translations: { language },
    },
  } = event;

  if (!(await fileStorage.exists(FileStorageLocation.Internal, key))) {
    throw new TranslationsFileNotFoundException();
  }

  console.log(key);

  return {};
};
