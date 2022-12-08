import { go, Task } from '@lemma/fx';
import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Error } from '~/lib/error';
import { RQuery } from './query';

/**
 * @note
 *
 * Fixed typing for react-query useInfiniteQuery key.
 */
type InfiniteQueryKey = readonly [string, string, string];

/**
 * @note
 *
 * Application-specific error type for useInfiniteQuery.
 */
type InfiniteQueryError = Error;

/**
 * @note
 *
 * Expected response type of paginiated query.
 */
type PaginiatedQueryResponse<TData> = {
  items: TData[];
  page: number;
  pages: number;
};

const FIRST_PAGE = 0;

function getNextPageParam(response: PaginiatedQueryResponse<unknown>): number | undefined {
  const { page, pages } = response;

  if (page + 1 >= pages) {
    return undefined;
  }

  return page + 1;
}

export default function usePaginatedQuery<TData>(
  key: InfiniteQueryKey,
  fn: (page: number) => Task<PaginiatedQueryResponse<TData>, unknown>
) {
  return useInfiniteQuery(key, ({ pageParam: page = FIRST_PAGE }) => go(page, fn, Task.mapRight(Error.from), Task.run), {
    ...RQuery.InfiniteQuery.defaultOptions,
    getNextPageParam,
  }) as UseInfiniteQueryResult<PaginiatedQueryResponse<TData>, InfiniteQueryError>;
}
