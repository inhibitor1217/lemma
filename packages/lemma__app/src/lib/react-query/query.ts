import { makeQueryKey } from './key';
import { presetQueryOptions } from './query-options';

export namespace RQuery {
  export const makeKey = makeQueryKey;

  export const defaultOptions = presetQueryOptions;

  export namespace InfiniteQuery {
    export const fromPaginatedApi = <TField extends string, TData>(field: TField) => ({
      getNextPageParam: (response: Record<TField, { items: TData[]; page: number; pages: number }>): number | undefined => {
        const {
          [field]: { page, pages },
        } = response;

        if (page + 1 >= pages) {
          return undefined;
        }

        return page + 1;
      },
    });
  }
}
