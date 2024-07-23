export type Pointer<_T = any> = {
  value: _T;
  address: number;
  destroy: () => void;
  dereference: () => _T;
  increment: () => Pointer<_T>;
  decrement: () => Pointer<_T>;
};

export type IrresponsiblePointer<_T = any> = {
  value: _T;
  address: number;
  increment: () => IrresponsiblePointer<_T>;
  decrement: () => IrresponsiblePointer<_T>;
};

export type DoublePointer<_T = any> = IrresponsiblePointer<Pointer<_T>>;

export class memory {
  /**
   * Allocate memory for a value and return a pointer to it
   * @param _value The number of bytes to allocate
   */
  static allocate = <T = any>(bytes: number): Pointer<T> =>
    bytes as unknown as Pointer<T>;

  /**
   * Deallocate a pointer
   */
  static deallocate = <T = any>(pointer: Pointer<T>): void => void pointer;

  /**
   * Create a unique pointer to a value
   */
  static pointer = <T = any>(value: T): Pointer<T> => value as Pointer<T>;

  /**
   * Create a shared pointer to a value
   */
  static sharedPointer = <T = any>(value: T): Pointer<T> => value as Pointer<T>;

  /**
   * Create a weak pointer to a value
   */
  static weakPointer = <T = any>(value: T): Pointer<T> => value as Pointer<T>;

  /**
   * Create an unsafe pointer to a value (uses C style pointers)
   */
  static unsafe = <T = any>(value: T): Pointer<T> => value as Pointer<T>;

  /**
   * Create a pointer that doesn't point to any valid memory location
   */
  static nullPointer = (): Pointer<null> => null as unknown as Pointer<null>;

  /**
   * Dereference a pointer to get the value it points to and deallocate the memory
   */
  static dereference = <T = any>(pointer: Pointer<T>): T => pointer as T;
}
