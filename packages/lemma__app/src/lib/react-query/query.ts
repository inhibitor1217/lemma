import { makeQueryKey } from './key';
import { presetQueryOptions } from './query-options';

export namespace RQuery {
  export const makeKey = makeQueryKey;

  export const defaultOptions = presetQueryOptions;
}
