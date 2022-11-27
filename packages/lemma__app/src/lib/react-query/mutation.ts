import { MutationOptions } from '@tanstack/react-query';
import { makeMutationKey } from './key';

export namespace RMutation {
  export const makeKey = makeMutationKey;

  export const defaultOptions: MutationOptions<any, any, any, any> = {};
}
