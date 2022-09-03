export enum ErrorSemantic {
  Disconnected = 'ErrorSemantic:Disconnected',
  Unauthorized = 'ErrorSemantic:Unauthorized',
  Unknown = 'ErrorSemantic:Unknown',
}

export type Error<P = unknown> = {
  semantic: ErrorSemantic;
  message: string;
  payload: P;
};
