export namespace Array {
  export const map =
    <A, B>(f: (a: A) => B) =>
    (fa: A[]): B[] =>
      fa.map(f);

  export const flatMap =
    <A, B>(f: (a: A) => B[]) =>
    (fa: A[]): B[] =>
      fa.flatMap(f);
}
