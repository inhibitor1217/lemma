import { Either } from '@lemma/fx';

export type ServerlessClient = {
  syncInvoke<P, R>(functionName: string, payload: P): Promise<Either<R, unknown>>;
  asyncInvoke<P>(functionName: string, payload: P): Promise<Either<void, unknown>>;
};

export class FunctionClient {
  private static readonly FUNCTION_NAME = '<function-name>';

  constructor(private readonly serverless: ServerlessClient) {}

  public syncInvoke(): Promise<Either<{}, unknown>> {
    return this.serverless.syncInvoke<{}, {}>(FunctionClient.FUNCTION_NAME, {});
  }

  public asyncInvoke(): Promise<Either<void, unknown>> {
    return this.serverless.asyncInvoke<{}>(FunctionClient.FUNCTION_NAME, {});
  }
}
