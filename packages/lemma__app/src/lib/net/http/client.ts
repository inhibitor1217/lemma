import axios, { AxiosError } from 'axios';
import { Error, ErrorSemantic } from '~/lib/error';

export interface HttpClient<E> {
  get: <R = unknown>(url: string) => Promise<R>;

  error: {
    use: (fn: (e: E) => Promise<Error>) => void;
  };
}

export namespace HttpClient {
  const errorLoggerInterceptor = (e: AxiosError) => {
    console.debug(new Date().toISOString(), `HttpClient:interceptors.response.error`, e);
    return Promise.reject(e);
  };

  export const create = <E>(): HttpClient<E> => {
    const instance = axios.create({ withCredentials: true });

    instance.interceptors.response.use(undefined, errorLoggerInterceptor);

    const get = <R = unknown>(url: string) => instance.get(url).then((res) => res.data as R);

    const useErrorMiddleware = (fn: (e: E) => Promise<Error>) =>
      instance.interceptors.response.use(undefined, (e: AxiosError<E>) => {
        if (!e.response) {
          return Promise.reject({
            semantic: ErrorSemantic.Disconnected,
            message: 'Unable to connect to the server.',
            payload: null,
          });
        }

        return fn(e.response.data);
      });

    return {
      get,

      error: {
        use: useErrorMiddleware,
      },
    };
  };
}
