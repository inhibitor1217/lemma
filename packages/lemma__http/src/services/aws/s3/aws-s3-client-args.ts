import { S3ClientConfig } from '@aws-sdk/client-s3';

export type AWSS3ClientArgs = S3ClientConfig;

export namespace AWSS3ClientArgs {
  export const region = (region: string): AWSS3ClientArgs => ({
    region,
  });

  export const customEndpoint = (endpoint: string): AWSS3ClientArgs => ({
    endpoint,
    forcePathStyle: true,
  });
}
