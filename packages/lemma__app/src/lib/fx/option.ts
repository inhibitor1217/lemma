export type Option<T> = Some<T> | None;
export type Some<T> = T;
export type None = null | undefined;

export namespace Option {
  export const some = <T>(a: T): Some<T> => a;
  export const none = (): None => null;
  export const of = <T>(a: NonNullable<T> | null | undefined): Option<NonNullable<T>> => a;

  export const isSome = <T>(value: Option<T>): value is Some<T> => value !== null && value !== undefined;
  export const isNone = <T>(value: Option<T>): value is None => value === null || value === undefined;

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

  export const reduce =
    <A, B>(onSome: (a: A) => B, onNone: () => B) =>
    (value: Option<A>): B =>
      isSome(value) ? onSome(value) : onNone();

  export const getOrElse =
    <A>(onNone: () => A) =>
    (value: Option<A>): A =>
      isSome(value) ? value : onNone();

  export const map =
    <A, B>(f: (a: A) => B) =>
    (value: Option<A>): Option<B> =>
      isNone(value) ? none() : some(f(value));

  export const flatMap =
    <A, B>(f: (a: A) => Option<B>) =>
    (value: Option<A>): Option<B> =>
      isNone(value) ? none() : f(value);
}
