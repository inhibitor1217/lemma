export namespace Struct {
  export const pick =
    <T extends Record<string, unknown>, K extends keyof T>(key: K) =>
    (obj: T) =>
      obj[key];

  export const evolve =
    <A, F extends { [K in keyof A]: (a: A[K]) => unknown }>(mappings: F) =>
    (a: A): { [K in keyof F]: ReturnType<F[K]> } => {
      const result: Record<string, unknown> = {};
      for (const k in a) {
        result[k] = mappings[k](a[k]);
      }
      return result as any;
    };
}
