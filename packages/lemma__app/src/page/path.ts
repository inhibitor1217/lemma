const resolve = (...paths: string[]) => `/${paths.join('/')}`;

export const InternalPath = {
  Root: resolve(),
  Authorize: resolve('authorize'),
  App: resolve('app'),
};
