export enum ErrorSemantic {
  Unauthorized,
  Unknown,
}

export type Error<P = unknown> = {
  semantic: ErrorSemantic;
  message: string;
  payload: P;
};
