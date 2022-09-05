export type Option<T> = Some<T> | None;
export type Some<T> = T;
export type None = null;

export namespace Option {
  export const some = <T>(value: T): Some<T> => value;
  export const none = (): None => null;
  export const of = <T>(value: NonNullable<T> | null | undefined): Option<NonNullable<T>> =>
    value === null || value === undefined ? none() : some(value);

  export const isSome = <T>(value: Option<T>): value is Some<T> => value !== null;
  export const isNone = <T>(value: Option<T>): value is None => value === null;

  export const unwrap = <T>(value: Option<T>): T => {
    if (isNone(value)) {
      throw new TypeError('Cannot unwrap None');
    }

    return value;
  };

  export const expect = <T>(value: Option<T>, message: string): T => {
    if (isNone(value)) {
      throw new TypeError(message);
    }

    return value;
  };
}
