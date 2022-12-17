import { InvokeCommand, InvocationType, LambdaClient } from '@aws-sdk/client-lambda';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSLambdaClientArgs, AWSLambdaClientLogger } from './client-args';

export namespace AWSLambdaClient {
  export type SyncInvokeResult<R> = R;
  export type SyncInvokeError = unknown;
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
          Payload: Buffer.from(JSON.stringify(payload)),
        })
      )
      .then((res) => {
        const { StatusCode, Payload } = res;

        if (!Payload) {
          throw new TypeError('AWSLambdaClient: sync invoke responded with no payload');
        }

        const result: R = JSON.parse(Buffer.from(Payload).toString('utf8'));
        return Either.ok(result);
      })
      .catch(
        pipe(
          tap((error) => this.logger.error(error)),
          Either.error
        )
      );
  }
}

export class FnExampleClient {
  private static readonly FUNCTION_NAME = 'fn-example';

  constructor(private readonly lambda: AWSLambdaClient) {}

  public syncInvoke(): Promise<Either<{}, unknown>> {
    return this.lambda.syncInvoke<{}, {}>(FnExampleClient.FUNCTION_NAME, {});
  }
}
