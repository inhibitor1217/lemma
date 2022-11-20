export enum ErrorSemantic {
  Disconnected = 'ErrorSemantic:Disconnected',
  InvalidEntity = 'ErrorSemantic:InvalidEntity',
  InvalidServiceRequest = 'ErrorSemantic:InvalidServiceRequest',
  Unauthorized = 'ErrorSemantic:Unauthorized',
  Unknown = 'ErrorSemantic:Unknown',
}

export namespace ErrorSemantic {
  export const values = Object.values(ErrorSemantic) as ErrorSemantic[];

  export const is = (value: unknown): value is ErrorSemantic => values.includes(value as ErrorSemantic);

  const TRANSIENT_ERROR_SEMANTICS = new Set([ErrorSemantic.Disconnected, ErrorSemantic.Unknown]);

  export const isTransient = (value: ErrorSemantic): boolean => TRANSIENT_ERROR_SEMANTICS.has(value);
}
