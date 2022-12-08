export namespace OffsetPagination {
  const FIRST_PAGE = 0;
  const DEFAULT_PAGE_SIZE = 64;

  export const requestSchemaQuerystringProperties = {
    page: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },
  };

  export type RequestQuerystring = {
    page?: number;
  };

  export type RequestOptions = {
    page: number;
  };

  export const qsToOptions = ({ page = FIRST_PAGE }: RequestQuerystring): RequestOptions => ({
    page,
  });

  export const optionsToRdbQuery = ({ page }: RequestOptions) => ({
    skip: page * DEFAULT_PAGE_SIZE,
    take: DEFAULT_PAGE_SIZE,
  });

  export const toNumPages = (count: number) => Math.ceil(count / DEFAULT_PAGE_SIZE);

  export type Reply<T> = {
    items: T[];
    pages: number;
    page: number;
  };
}
