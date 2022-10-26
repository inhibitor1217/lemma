import { type AuthorizePage } from '~/feature/auth';
import { URL } from '~/lib/net/url';

const resolve = (...paths: string[]) => `/${paths.join('/')}`;

export const InternalPath = {
  Root: resolve(),
  Authorize: {
    _: resolve('authorize'),
    _path: resolve('authorize'),
    _query: URL.withQuery<AuthorizePage.QueryParams>(resolve('authorize')),
  },
  App: {
    _: resolve('app'),
    _path: resolve('app'),

    Workspaces: {
      _: resolve('app', 'workspaces'),
      _path: resolve('workspaces'),
    },
  },
};
