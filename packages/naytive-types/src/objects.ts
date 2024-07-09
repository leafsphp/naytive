export type struct<T> = T extends { [key: string]: any } ? T : never;

export type array<T, _N extends number> = T[];
