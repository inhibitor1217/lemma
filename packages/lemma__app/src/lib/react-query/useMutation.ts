import { useMutation as _useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { Error } from '~/lib/error';
import { go, pipe, Task } from '@lemma/fx';
import { RMutation } from './mutation';

/**
 * @note
 *
 * Fixed typing for react-query useMutation key.
 */
type MutationKey = readonly [string, string, string];

/**
 * @note
 *
 * Application-specific error type for useMutation.
 */
type MutationError = Error;

export function useMutation<TData = void>(
  key: MutationKey,
  fn: Task<TData, unknown>,
  options: Omit<UseMutationOptions<TData, MutationError>, 'mutationFn'>
) {
  return _useMutation(key, go(fn, Task.mapRight(Error.from)), {
    ...RMutation.defaultOptions,
    ...options,
  }) as UseMutationResult<TData, MutationError, void>;
}

export function useParametricMutation<TParams, TData = void>(
  key: MutationKey,
  fn: (params: TParams) => Task<TData, unknown>,
  options: Omit<UseMutationOptions<TData, MutationError, TParams>, 'mutationFn'>
) {
  return _useMutation(key, pipe(fn, Task.mapRight(Error.from), Task.run), {
    ...RMutation.defaultOptions,
    ...options,
  }) as UseMutationResult<TData, MutationError, TParams>;
}
