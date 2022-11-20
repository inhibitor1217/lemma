import { pipe } from './pipe';

export type Task<A, E> = () => Promise<A>;

export namespace Task {
  export const of =
    <A, E>(a: A): Task<A, E> =>
    () =>
      Promise.resolve(a);

  export const ofError =
    <A, E>(e: E): Task<A, E> =>
    () =>
      Promise.reject(e);

  export const run = <A, E>(fa: Task<A, E>): Promise<A> => fa();

  export const mapLeft =
    <A, B, E>(f: (a: A) => B) =>
    (fa: Task<A, E>): Task<B, E> =>
    () =>
      fa().then(f);

  export const mapRight =
    <A, E, F>(f: (e: E) => F) =>
    (fa: Task<A, E>): Task<A, F> =>
    () =>
      fa().catch(pipe(f, Promise.reject));

  export const flatMapLeft =
    <A, B, E>(f: (a: A) => Task<B, E>) =>
    (fa: Task<A, E>): Task<B, E> =>
    () =>
      fa().then((a) => f(a)());
}
