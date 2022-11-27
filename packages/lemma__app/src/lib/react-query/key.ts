export const makeQueryKey = (domain: string, service: string, method: string) => [domain, service, method] as const;

export const makeParametricQueryKey = (domain: string, service: string, method: string, params: unknown) =>
  [domain, service, method, params] as const;

export const makeMutationKey = (domain: string, service: string, method: string) => [domain, service, method] as const;
