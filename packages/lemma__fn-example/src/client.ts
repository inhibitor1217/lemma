import { Either } from '@lemma/fx';

export type FunctionClient = {
  syncInvoke<P, R>(functionName: string, payload: P): Promise<Either<R, unknown>>;
  asyncInvoke<P>(functionName: string, payload: P): Promise<Either<void, unknown>>;
};

export class FnExampleClient {
  private static readonly FUNCTION_NAME = 'fn-example';

  constructor(private readonly fn: FunctionClient) {}

  public syncInvoke(): Promise<Either<{}, unknown>> {
    return this.fn.syncInvoke<{}, {}>(FnExampleClient.FUNCTION_NAME, {});
  }

  public asyncInvoke(): Promise<Either<void, unknown>> {
    return this.fn.asyncInvoke<{}>(FnExampleClient.FUNCTION_NAME, {});
  }
}
