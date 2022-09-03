export enum ErrorSemantic {
  Unauthorized = 'ErrorSemantic:Unauthorized',
  Unknown = 'ErrorSemantic:Unknown',
}

export type Error<P = unknown> = {
  semantic: ErrorSemantic;
  message: string;
  payload: P;
};
