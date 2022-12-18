import { Either } from '@lemma/fx';
import { Event, Result } from './types';

export type ServerlessClient = {
  syncInvoke<P, R>(functionName: string, payload: P): Promise<Either<R, unknown>>;
  asyncInvoke<P>(functionName: string, payload: P): Promise<Either<void, unknown>>;
};

export class FunctionClient {
  private static readonly FUNCTION_NAME = 'fn-import-translations-from-file';

  constructor(private readonly serverless: ServerlessClient) {}

  public syncInvoke(event: Event): Promise<Either<Result, unknown>> {
    return this.serverless.syncInvoke<Event, Result>(FunctionClient.FUNCTION_NAME, event);
  }

  public asyncInvoke(event: Event): Promise<Either<void, unknown>> {
    return this.serverless.asyncInvoke<Event>(FunctionClient.FUNCTION_NAME, event);
  }
}
