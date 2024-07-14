export type Pointer<_T = any> = { dereference: () => _T };

export class memory {
  static pointer = <T = any>(value: T): Pointer<T> => value as Pointer<T>;
  static dereference = <T = any>(pointer: Pointer<T>): T => pointer as T;
}
