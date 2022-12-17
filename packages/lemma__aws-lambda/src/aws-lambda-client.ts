import { InvokeCommand, InvocationType, LambdaClient } from '@aws-sdk/client-lambda';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSLambdaClientArgs, AWSLambdaClientLogger } from './aws-lambda-client-args';

export namespace AWSLambdaClient {
  export type SyncInvokeResult<R> = R;
  export type SyncInvokeError = unknown;

  export type AsyncInvokeResult = void;
  export type AsyncInvokeError = unknown;
}

export class AWSLambdaClient {
  private readonly client: LambdaClient;
  private readonly logger: AWSLambdaClientLogger;

  constructor(private readonly args: AWSLambdaClientArgs) {
    const { logger, ...rest } = args;

    this.client = new LambdaClient(rest);
    this.logger = logger;
  }

  public syncInvoke<P, R>(
    functionName: string,
    payload: P
  ): Promise<Either<AWSLambdaClient.SyncInvokeResult<R>, AWSLambdaClient.SyncInvokeError>> {
    this.logger.debug(`AWSLambdaClient: sync invoke`);
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
          Either.error
        )
      );
  }

  public asyncInvoke<P>(
    functionName: string,
    payload: P
  ): Promise<Either<AWSLambdaClient.AsyncInvokeResult, AWSLambdaClient.AsyncInvokeError>> {
    this.logger.debug(`AWSLambdaClient: async invoke`);
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
          Either.error
        )
      );
  }

  private static toPayload(payload: unknown): Uint8Array {
    return Buffer.from(JSON.stringify(payload));
  }

  private static fromPayload(payload: Uint8Array): unknown {
    return JSON.parse(Buffer.from(payload).toString('utf8'));
  }
}
