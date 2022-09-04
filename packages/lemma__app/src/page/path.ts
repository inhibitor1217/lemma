import { AuthorizePage } from '~/feature/auth';
import { URL } from '~/lib/net/url';

const resolve = (...paths: string[]) => `/${paths.join('/')}`;

export const InternalPath = {
  Root: resolve(),
  Authorize: {
    _: resolve('authorize'),
    query: URL.withQuery<AuthorizePage.QueryParams>(resolve('authorize')),
  },
  App: {
    _: resolve('app'),
  },
};
