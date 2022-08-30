import { Env } from '~/lib/env';

export namespace HttpApi {
  export const url = (path: string): string => `${Env.httpApiHost}${path}`;
}
