import { Either } from './either';
import { id } from './pipe';

export type Match = {
  <A, B>(f1: (a: A) => Either<B, A>, fallback: (a: unknown) => B): (a: A) => B;
  <A, B, C>(f1: (a: A) => Either<C, A>, f2: (a: B) => Either<C, B>, fallback: (a: unknown) => C): (a: A | B) => C;
  <A, B, C, D>(f1: (a: A) => Either<D, A>, f2: (a: B) => Either<D, B>, f3: (a: C) => Either<D, C>, fallback: (a: unknown) => D): (
    a: A | B | C
  ) => D;
  <A, B, C, D, E>(
    f1: (a: A) => Either<E, A>,
    f2: (a: B) => Either<E, B>,
    f3: (a: C) => Either<E, C>,
    f4: (a: D) => Either<E, D>,
    fallback: (a: unknown) => E
  ): (a: A | B | C | D) => E;
  <A, B, C, D, E, F>(
    f1: (a: A) => Either<F, A>,
    f2: (a: B) => Either<F, B>,
    f3: (a: C) => Either<F, C>,
    f4: (a: D) => Either<F, D>,
    f5: (a: E) => Either<F, E>,
    fallback: (a: unknown) => F
  ): (a: A | B | C | D | E) => F;
};

export const match: Match =
  (...fs: any[]) =>
  (a: any) =>
    fs.reduce((result, f) => Either.mapOrElse(id, f)(result), Either.right(a));

export namespace Match {
  export const instance =
    <A, B>(clazz: { new (...args: any[]): A }, f: (a: A) => B) =>
    <T>(a: T): Either<B, Exclude<T, A>> =>
      a instanceof clazz ? Either.ok(f(a)) : Either.error(a as Exclude<T, A>);
}
