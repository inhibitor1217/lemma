export type Exception<E, A> = {
  readonly type: E;
  readonly attrs: A;
  readonly raw?: unknown;
};

export type ExceptionClass<E, A> = {
  new (attrs: A, raw?: unknown): Exception<E, A>;
};

export const defineException =
  <E1 extends string, E2 extends string>(domain: E1, type: E2) =>
  <A>(): ExceptionClass<`${E1}.${E2}`, A> => {
    class TypedException {
      readonly type: `${E1}.${E2}` = `${domain}.${type}` as const;
      constructor(readonly attrs: A, readonly raw?: unknown) {}

      toString(): string {
        return `${this.type}: ${JSON.stringify(this.attrs)}`;
      }

      toJSON(): unknown {
        return {
          type: this.type,
          attrs: this.attrs,
          raw: this.raw,
        };
      }
    }

    return TypedException;
  };
