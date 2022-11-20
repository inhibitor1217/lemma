import { useQuery as _useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Error } from '~/lib/error';
import { go, Task } from '~/lib/fx';
import { RQuery } from './query';

/**
 * @note
 *
 * Fixed typing for react-query useQuery key.
 */
type QueryKey = string[];

/**
 * @note
 *
 * Application-specific error type for useQuery.
 */
type QueryError = Error;

export default function useQuery<TData = unknown>(
  key: string[],
  fn: Task<TData, unknown>,
  options?: Omit<UseQueryOptions<unknown, QueryError, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return _useQuery(key, go(fn, Task.mapRight(Error.from)), {
    ...(RQuery.defaultOptions as UseQueryOptions<unknown, QueryError, TData, QueryKey>),
    ...options,
  }) as UseQueryResult<TData, QueryError>;
}
