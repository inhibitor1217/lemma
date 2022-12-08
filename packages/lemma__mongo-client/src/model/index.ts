import { Translation } from './translation';

export const models = {
  Translation,
};

type Instanced<T> = T extends new (...args: any[]) => infer R ? R : never;

export type Translation = Instanced<typeof Translation>;
