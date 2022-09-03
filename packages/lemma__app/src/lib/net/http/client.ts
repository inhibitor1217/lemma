import axios from 'axios';

export namespace HttpClient {
  export const get = <Result = unknown, Error = unknown>(url: string) => axios.get<Result, Error>(url);
}
