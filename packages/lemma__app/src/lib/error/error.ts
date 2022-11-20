import { ErrorSemantic } from './error-semantic';

export type Error<P = unknown> = {
  semantic: ErrorSemantic;
  message: string;
  payload: P;
};

export namespace Error {
  export const isError = (e: unknown): e is Error => {
    return (
      typeof e === 'object' &&
      e !== null &&
      Object.prototype.hasOwnProperty.call(e, 'semantic') &&
      typeof (e as { semantic: unknown }).semantic === 'string' &&
      ErrorSemantic.is((e as { semantic: string }).semantic) &&
      Object.prototype.hasOwnProperty.call(e, 'message') &&
      typeof (e as { message: unknown }).message === 'string' &&
      Object.prototype.hasOwnProperty.call(e, 'payload')
    );
  };

  export const isSemanticOf = (e: Error, semantic: ErrorSemantic): boolean => e.semantic === semantic;

  export const from = (e: unknown): Error => {
    if (isError(e)) {
      return e;
    }

    return {
      semantic: ErrorSemantic.Unknown,
      message: 'Oops, something went wrong.',
      payload: e,
    };
  };
}
