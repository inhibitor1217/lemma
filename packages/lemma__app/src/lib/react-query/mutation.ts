import { makeMutationKey } from './key';
import { presetMutationOptions } from './mutation-options';

export namespace RMutation {
  export const makeKey = makeMutationKey;

  export const defaultOptions = presetMutationOptions;
}
