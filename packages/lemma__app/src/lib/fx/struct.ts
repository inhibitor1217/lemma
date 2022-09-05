export namespace Struct {
  export const pick =
    <T extends Record<string, unknown>, K extends keyof T>(key: K) =>
    (obj: T) =>
      obj[key];
}
