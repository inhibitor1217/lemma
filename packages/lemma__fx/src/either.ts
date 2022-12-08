const LEFT_TAG = Symbol('Left');
const RIGHT_TAG = Symbol('Right');

export type Either<A, B> = Left<A> | Right<B>;

export type Left<A> = { value: A; __tag: typeof LEFT_TAG };
export type Right<B> = { value: B; __tag: typeof RIGHT_TAG };
export type Ok<A> = Left<A>;
export type Error<B> = Right<B>;

export namespace Either {
  export const left = <A>(a: A): Left<A> => ({ value: a, __tag: LEFT_TAG });
  export const right = <B>(b: B): Right<B> => ({ value: b, __tag: RIGHT_TAG });

  export const ok = left;
  export const error = right;

  export const isLeft = <A, B>(either: Either<A, B>): either is Left<A> => either.__tag === LEFT_TAG;
  export const isRight = <A, B>(either: Either<A, B>): either is Right<B> => either.__tag === RIGHT_TAG;

  export const isOk = isLeft;
  export const isError = isRight;

  export const isLeftAnd =
    <A, B>(f: (a: A) => boolean) =>
    (either: Either<A, B>): either is Left<A> =>
      isLeft(either) && f(either.value);

  export const isRightAnd =
    <A, B>(f: (b: B) => boolean) =>
    (either: Either<A, B>): either is Right<B> =>
      isRight(either) && f(either.value);

  export const expect = <A, B>(either: Either<A, B>, message: string): A => {
    if (isRight(either)) {
      throw new TypeError(message);
    }

    return either.value;
  };

  export const unwrap = <A, B>(either: Either<A, B>): A => {
    if (isRight(either)) {
      throw new TypeError('Cannot unwrap Right');
    }

    return either.value;
  };

  export const reduce =
    <A, B, C>(onLeft: (a: A) => C, onRight: (b: B) => C) =>
    (either: Either<A, B>): C =>
      isLeft(either) ? onLeft(either.value) : onRight(either.value);

  export const mapLeft =
    <A, B, C>(f: (a: A) => C) =>
    (either: Either<A, B>): Either<C, B> =>
      isLeft(either) ? left(f(either.value)) : either;

  export const mapRight =
    <A, B, C>(f: (b: B) => C) =>
    (either: Either<A, B>): Either<A, C> =>
      isRight(either) ? right(f(either.value)) : either;

  export const map = mapLeft;
  export const mapOr = mapRight;
  export const mapOrElse = reduce;

  export const flatMapLeft =
    <A, B, C>(f: (a: A) => Either<C, B>) =>
    (either: Either<A, B>): Either<C, B> =>
      isLeft(either) ? f(either.value) : either;

  export const flatMapRight =
    <A, B, C>(f: (b: B) => Either<A, C>) =>
    (either: Either<A, B>): Either<A, C> =>
      isRight(either) ? f(either.value) : either;

  export const flatMap = flatMapLeft;
  export const retry = flatMapRight;
}
