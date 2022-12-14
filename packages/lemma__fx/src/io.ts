export type IO<T> = () => T;

export namespace IO {
  export const of =
    <A>(a: A): IO<A> =>
    () =>
      a;

  export const run = <T>(a: IO<T>): T => a();

  export const map =
    <A, B>(f: (a: A) => B) =>
    (a: IO<A>): IO<B> =>
    () =>
      f(a());

  export const flatMap =
    <A, B>(f: (a: A) => IO<B>) =>
    (a: IO<A>): IO<B> =>
    () =>
      f(a())();
}
