const goOne = (a: any, f: any) => f(a);

type Go = {
  <A, B>(a: A, f1: (a: A) => B): B;
  <A, B, C>(a: A, f1: (a: A) => B, f2: (b: B) => C): C;
  <A, B, C, D>(a: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): D;
  <A, B, C, D, E>(a: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E): E;
  <A, B, C, D, E, F>(a: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E, f5: (e: E) => F): F;
  <A, B, C, D, E, F, G>(
    a: A,
    f1: (a: A) => B,
    f2: (b: B) => C,
    f3: (c: C) => D,
    f4: (d: D) => E,
    f5: (e: E) => F,
    f6: (f: F) => G
  ): G;
  (a: unknown, ...fs: ((a: unknown) => unknown)[]): unknown;
};

export const go: Go = (a: any, ...fs: any[]) => fs.reduce(goOne, a);

type Pipe = {
  <A, B>(f1: (a: A) => B): (a: A) => B;
  <A, B, C>(f1: (a: A) => B, f2: (b: B) => C): (a: A) => C;
  <A, B, C, D>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): (a: A) => D;
  <A, B, C, D, E>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E): (a: A) => E;
  <A, B, C, D, E, F>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E, f5: (e: E) => F): (a: A) => F;
  <A, B, C, D, E, F, G>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E, f5: (e: E) => F, f6: (f: F) => G): (
    a: A
  ) => G;
  (...fs: ((a: unknown) => unknown)[]): (a: unknown) => unknown;
};

export const pipe: Pipe =
  (...fs: any[]) =>
  (a: any) =>
    go(a, ...fs);
