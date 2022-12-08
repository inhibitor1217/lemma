import { Array, id, Option, Struct } from '@lemma/fx';

export namespace HttpApiOffsetPagination {
  export type RequestDTO = {
    page: Option<number>;
  };

  export type ResponseDTO<ItemType> = {
    items: ItemType[];
    pages: number;
    page: number;
  };

  export const resolve = <A, B>(itemResolver: (item: A) => B): ((paginatedResponse: ResponseDTO<A>) => ResponseDTO<B>) =>
    Struct.evolve({
      items: Array.map(itemResolver),
      pages: id<number>,
      page: id<number>,
    });
}
