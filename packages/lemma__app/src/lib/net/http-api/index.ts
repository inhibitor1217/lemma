import { Env } from '~/lib/env';
import { HttpClient } from '~/lib/net/http';
import { HttpApiError } from './error';

export namespace HttpApi {
  export const url = (path: string, params?: URLSearchParams): string => {
    const url = new URL(path, Env.httpApiHost);
    if (params) {
      url.search = params.toString();
    }
    return url.toString();
  };

  const httpClient = (() => {
    const client = HttpClient.create<HttpApiError.DTO>();

    client.error.use((e) => Promise.reject(HttpApiError.toError(e)));

    return client;
  })();

  export const get = httpClient.get;

  export const post = httpClient.post;

  export const delete_ = httpClient.delete;
}

export { HttpApiError } from './error';
