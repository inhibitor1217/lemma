import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Error, ErrorSemantic } from '~/lib/error';

export interface HttpClient<E> {
  get: <R = unknown>(url: string) => Promise<R>;
  post: <T = unknown, R = unknown>(url: string, data: T) => Promise<R>;
  delete: (url: string) => Promise<void>;

  error: {
    use: (fn: (e: E) => Promise<Error>) => void;
  };
}

export namespace HttpClient {
  const requestLoggerInterceptor = (config: AxiosRequestConfig) => {
    console.debug(new Date().toISOString(), 'HttpClient:interceptors.request', config.method, config.url);
    return config;
  };

  const successLoggerInterceptor = (res: AxiosResponse) => {
    console.debug(
      new Date().toISOString(),
      'HttpClient:interceptors.response.success',
      res.config.method,
      res.config.url,
      res.status,
      res.statusText,
      res.data
    );
    return res;
  };

  const errorLoggerInterceptor = (e: AxiosError) => {
    console.debug(new Date().toISOString(), `HttpClient:interceptors.response.error`, e);
    return Promise.reject(e);
  };

  export const create = <E>(): HttpClient<E> => {
    const instance = axios.create({ withCredentials: true });

    instance.interceptors.request.use(requestLoggerInterceptor);
    instance.interceptors.response.use(successLoggerInterceptor, errorLoggerInterceptor);

    const get = <R = unknown>(url: string) => instance.get(url).then((res) => res.data as R);

    const post = <T = unknown, R = unknown>(url: string, data: T) => instance.post(url, data).then((res) => res.data as R);

    const delete_ = (url: string) => instance.delete(url).then(() => undefined);

    const useErrorMiddleware = (fn: (e: E) => Promise<Error>) =>
      instance.interceptors.response.use(undefined, (e: AxiosError<E>) => {
        if (!e.response || !e.response.status) {
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
      post,
      delete: delete_,

      error: {
        use: useErrorMiddleware,
      },
    };
  };
}
