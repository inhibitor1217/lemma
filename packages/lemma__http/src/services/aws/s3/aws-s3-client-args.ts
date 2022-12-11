import { S3ClientConfig } from '@aws-sdk/client-s3';

export type AWSS3ClientLogger = {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

export type AWSS3ClientArgs = S3ClientConfig & {
  logger: AWSS3ClientLogger;
  resourcePrefix: string;
};

export namespace AWSS3ClientArgs {
  export const region = (args: { region: string; resourcePrefix: string; logger: AWSS3ClientLogger }): AWSS3ClientArgs => ({
    logger: args.logger,
    region: args.region,
    resourcePrefix: args.resourcePrefix,
  });

  export const customEndpoint = (args: {
    endpoint: string;
    resourcePrefix: string;
    logger: AWSS3ClientLogger;
  }): AWSS3ClientArgs => ({
    endpoint: args.endpoint,
    forcePathStyle: true,
    logger: args.logger,
    resourcePrefix: args.resourcePrefix,
  });
}
