import { LambdaClientConfig } from '@aws-sdk/client-lambda';

export type AWSLambdaClientLogger = {
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
};

export type AWSLambdaClientArgs = LambdaClientConfig & {
  logger: AWSLambdaClientLogger;
};

export namespace AWSLambdaClientArgs {
  export const region = (args: { region: string; logger: AWSLambdaClientLogger }): AWSLambdaClientArgs => ({
    logger: args.logger,
    region: args.region,
  });

  export const customEndpoint = (args: {
    region: string;
    endpoint: string;
    logger: AWSLambdaClientLogger;
  }): AWSLambdaClientArgs => ({
    region: args.region,
    endpoint: args.endpoint,
    logger: args.logger,
  });
}
