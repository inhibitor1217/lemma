import axios, { type AxiosRequestConfig } from 'axios';

export namespace HttpClient {
  const axiosRequestOptions: AxiosRequestConfig = {
    withCredentials: true,
  };

  export const get = <Result = unknown, Error = unknown>(url: string) => axios.get<Result, Error>(url, axiosRequestOptions);
}
