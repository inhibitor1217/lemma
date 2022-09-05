export namespace PrimitiveType {
  export type ID = number & { __brand: 'ID' };
  export type ISO8601DateTime = string & { __brand: 'ISO8601DateTime' };
  export type Email = string & { __brand: 'Email' };
  export type URL = string & { __brand: 'URL' };
}

export namespace FieldResolver {
  export const String = (a: string) => a;

  export const ID = (a: number): PrimitiveType.ID => a as PrimitiveType.ID;

  export const Date = {
    fromISO8601: (a: PrimitiveType.ISO8601DateTime) => new window.Date(a),
  };

  export const Email = (a: string): PrimitiveType.Email => a as PrimitiveType.Email;

  export const URL = (a: string): PrimitiveType.URL => a as PrimitiveType.URL;

  export const Enumeration = <T extends string>(a: string): T => a as T;
}
