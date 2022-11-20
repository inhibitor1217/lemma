import { UseInfiniteQueryOptions, UseQueryOptions } from '@tanstack/react-query';
import { makeQueryKey } from './key';
import { retry } from './query-options';

export namespace RQuery {
  export const makeKey = makeQueryKey;

  export const defaultOptions: UseQueryOptions<any, any, any, any> = {
    retry,
  };

  export namespace InfiniteQuery {
    export const defaultOptions: UseInfiniteQueryOptions<any, any, any, any, any> = {
      retry,
    };
  }
}
