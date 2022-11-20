import { useMutation as _useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { Error } from '~/lib/error';
import { go, Task } from '~/lib/fx';
import { RMutation } from './mutation';

/**
 * @note
 *
 * Fixed typing for react-query useMutation key.
 */
type MutationKey = string[];

/**
 * @note
 *
 * Application-specific error type for useMutation.
 */
type MutationError = Error;

export default function useMutation<TData = void>(
  key: MutationKey,
  fn: Task<TData, unknown>,
  options: Omit<UseMutationOptions<TData, MutationError>, 'mutationFn'>
) {
  return _useMutation(key, go(fn, Task.mapRight(Error.from)), {
    ...RMutation.defaultOptions,
    ...options,
  }) as UseMutationResult<TData, MutationError, void>;
}
