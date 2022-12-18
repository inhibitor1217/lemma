import { AWSS3Client, AWSS3ClientArgs } from '@lemma/aws-s3';
import { FileStorageClient } from '@lemma/file-storage-client';
import { Handler } from 'aws-lambda';
import { Event, Result } from './types';

const s3 = new AWSS3Client(
  process.env.STAGE === 'local'
    ? AWSS3ClientArgs.customEndpoint({
        endpoint: process.env.AWS_ENDPOINT || '',
        resourcePrefix: process.env.AWS_RESOURCE_PREFIX || '',
        logger: console,
      })
    : AWSS3ClientArgs.region({
        region: process.env.AWS_REGION || '',
        resourcePrefix: process.env.AWS_RESOURCE_PREFIX || '',
        logger: console,
      })
);

const fileStorage = new FileStorageClient(s3);

export const handler: Handler<Event, Result> = (event, context) => {
  return Promise.resolve({});
};
