export type Nullish<T> = T | null | undefined;

export type WithNullish<T, K extends keyof T = keyof T> =
  Omit<T, K> & {
    [P in K]: Nullish<T[P]>;
  };

export type Nullable<T> = T | null;
