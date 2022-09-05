export type IO<T> = () => T;

export namespace IO {
  export const of =
    <T>(a: T): IO<T> =>
    () =>
      a;

  export const run = <T>(a: IO<T>): T => a();

  export const map =
    <A, B>(f: (a: A) => B) =>
    (a: IO<A>): IO<B> =>
    () =>
      f(a());
}
