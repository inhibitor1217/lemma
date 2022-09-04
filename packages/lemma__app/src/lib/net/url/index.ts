export namespace URL {
  const querystring = (params: Record<string, string>) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      query.set(key, value);
    }
    return query.toString();
  };

  export const withQuery =
    <QueryParams extends Record<string, string>>(path: string) =>
    (queryParams: QueryParams) =>
      `${path}?${querystring(queryParams)}`;
}

export { useSearchParams } from './useSearchParams';
