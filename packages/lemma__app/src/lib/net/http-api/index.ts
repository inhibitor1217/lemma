import { Env } from '~/lib/env';

export namespace HttpApi {
  export const url = (path: string, params?: URLSearchParams): string => {
    const url = new URL(path, Env.httpApiHost);
    if (params) {
      url.search = params.toString();
    }
    return url.toString();
  };
}

export { HttpApiError } from './error';
