export const makeQueryKey = (domain: string, service: string, method: string) => `query/${domain}:${service}:${method}`;

export const makeMutationKey = (domain: string, service: string, method: string) => `mutation/${domain}:${service}:${method}`;
