export class Future<T> {
  private readonly _promise: Promise<T>;
  private _resolve?: (value: T) => void;
  private _reject?: (reason: unknown) => void;

  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  get promise(): Promise<T> {
    return this._promise;
  }

  resolve(value: T): void {
    this._resolve?.(value);
  }

  reject(reason: unknown): void {
    this._reject?.(reason);
  }
}
