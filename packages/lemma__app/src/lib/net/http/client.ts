import axios from 'axios';
import { Error } from '~/lib/error';

export interface HttpClient<E> {
  get: <R = unknown>(url: string) => Promise<R>;

  error: {
    use: (fn: (e: E) => Promise<Error>) => void;
  };
}

export namespace HttpClient {
  export const create = <E>(): HttpClient<E> => {
    const instance = axios.create({ withCredentials: true });

    const get = <R = unknown>(url: string) => instance.get(url).then((res) => res.data as R);

    const useErrorMiddleware = (fn: (e: E) => Promise<Error>) =>
      instance.interceptors.response.use(undefined, (e) => fn(e.response.data));

    return {
      get,

      error: {
        use: useErrorMiddleware,
      },
    };
  };
}
