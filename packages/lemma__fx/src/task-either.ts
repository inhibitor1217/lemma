import { Either } from './either';
import { Task } from './task';

export type TaskEither<A, B> = Task<Either<A, B>>;

export namespace TaskEither {
  export const left = <A, B>(a: A): TaskEither<A, B> => Task.of(Either.left(a));
  export const right = <A, B>(b: B): TaskEither<A, B> => Task.of(Either.right(b));

  export const ok = left;
  export const error = right;

  export const reduce =
    <A, B, C>(onLeft: (a: A) => C, onRight: (b: B) => C) =>
    (fa: TaskEither<A, B>): Task<C> =>
      Task.mapLeft(Either.reduce<A, B, C>(onLeft, onRight))(fa);

  export const mapLeft =
    <A, B, C>(f: (a: A) => C) =>
    (fa: TaskEither<A, B>): TaskEither<C, B> =>
      Task.mapLeft(Either.mapLeft<A, B, C>(f))(fa);

  export const mapRight =
    <A, B, C>(f: (b: B) => C) =>
    (fa: TaskEither<A, B>): TaskEither<A, C> =>
      Task.mapLeft(Either.mapRight<A, B, C>(f))(fa);

  export const map = mapLeft;
  export const mapOr = mapRight;
  export const mapOrElse = reduce;

  export const flatMapLeft =
    <A, B, C>(f: (a: A) => TaskEither<C, B>) =>
    (fa: TaskEither<A, B>): TaskEither<C, B> =>
    () =>
      fa().then((result) => {
        if (Either.isLeft(result)) {
          return f(Either.unwrap(result))();
        }

        return result;
      });
}
