import { InvokeCommand, InvocationType, LambdaClient } from '@aws-sdk/client-lambda';
import { defineException } from '@lemma/exception';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSLambdaClientArgs, AWSLambdaClientLogger } from './aws-lambda-client-args';

export class AWSLambdaClient {
  private readonly client: LambdaClient;
  private readonly logger: AWSLambdaClientLogger;

  constructor(private readonly args: AWSLambdaClientArgs) {
    const { logger, ...rest } = args;

    this.client = new LambdaClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      ...rest,
    });
    this.logger = logger;
  }

  public syncInvoke<P, R>(
    functionName: string,
    payload: P
  ): Promise<Either<AWSLambdaClient.SyncInvoke<R>['Result'], AWSLambdaClient.SyncInvoke<R>['Error']>> {
    this.logger.debug(`AWSLambdaClient#syncInvoke`);
    this.logger.debug({
      functionName,
      payload,
    });

    return this.client
      .send(
        new InvokeCommand({
          FunctionName: functionName,
          InvocationType: InvocationType.RequestResponse,
          Payload: AWSLambdaClient.toPayload(payload),
        })
      )
      .then((res) => {
        const { Payload } = res;

        if (!Payload) {
          throw new TypeError('AWSLambdaClient: sync invoke responded with no payload');
        }

        return Either.ok(AWSLambdaClient.fromPayload(Payload) as R);
      })
      .catch(
        pipe(
          tap((error) => this.logger.error(error)),
          AWSLambdaClient.mapAWSLambdaError
        )
      );
  }

  public asyncInvoke<P>(
    functionName: string,
    payload: P
  ): Promise<Either<AWSLambdaClient.AsyncInvoke['Result'], AWSLambdaClient.AsyncInvoke['Error']>> {
    this.logger.debug(`AWSLambdaClient#asyncInvoke`);
    this.logger.debug({
      functionName,
      payload,
    });

    return this.client
      .send(
        new InvokeCommand({
          FunctionName: functionName,
          InvocationType: InvocationType.Event,
          Payload: AWSLambdaClient.toPayload(payload),
        })
      )
      .then(() => Either.ok(undefined))
      .catch(
        pipe(
          tap((error) => this.logger.error(error)),
          AWSLambdaClient.mapAWSLambdaError
        )
      );
  }

  private static toPayload(payload: unknown): Uint8Array {
    return Buffer.from(JSON.stringify(payload));
  }

  private static fromPayload(payload: Uint8Array): unknown {
    return JSON.parse(Buffer.from(payload).toString('utf8'));
  }

  private static mapAWSLambdaError(error: unknown): Either<any, AWSLambdaClient.AWSLambdaError> {
    return Either.error(new AWSLambdaClient.AWSLambdaError({}, error));
  }
}

export namespace AWSLambdaClient {
  export const AWSLambdaError = defineException('AWSLambdaClient', 'AWSLambdaError')<{}>();
  export type AWSLambdaError = InstanceType<typeof AWSLambdaError>;

  export type SyncInvoke<R> = {
    Result: R;
    Error: AWSLambdaError;
  };

  export type AsyncInvoke = {
    Result: void;
    Error: AWSLambdaError;
  };
}
