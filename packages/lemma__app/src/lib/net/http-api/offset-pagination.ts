import { Option } from '~/lib/fx';

export namespace HttpApiOffsetPagination {
  export type RequestDTO = {
    page: Option<number>;
  };

  export type ResponseDTO<ItemType> = {
    items: ItemType[];
    pages: number;
    page: number;
  };
}
