# Pointers and Memory

Naytive doesn't have a traditional garbage collector, however, it still manages memory for you and tries to be as efficient as possible.

Naytive tries to keep all your data in stack memory without having you to worry about it. This means that Naytive will automatically set the needed memory for your variables even if you don't specify it eg. `const a = 5` will automatically set the memory for `a` to be 16-bits because it is an unsigned short integer, similarly `const b = 5.0` will set the memory for `b` to be 32-bits instead of the traditional 64-bits for a double.

Also, Naytive will automatically free the memory for you when the variable goes out of scope. This means that you don't have to worry about memory leaks or freeing memory yourself, though we still recommend sticking to the best practices.

You can also manually manage memory using UnsafePointers and memory allocations.

![image](https://github.com/user-attachments/assets/b61c7440-b33a-480b-988c-99c82204d68d)

## Memory Errors

Low-level programming can be error-prone, especially when working with pointers and memory addresses. Naytive has tons of built-in checks to prevent memory errors, such as null pointer dereference, buffer overflows, and memory leaks, however, it is still possible to make mistakes. It is therefore important to learn about these errors and how to prevent them.

### Null Pointer Dereference

A null pointer dereference occurs when you try to access the memory address of a null pointer. This can lead to a segmentation fault and crash your program. In simpler terms, it's like trying to access a property of an undefined object in JavaScript.

```ts
const ptr: Pointer<int> = memory.pointer(...);

// We can create a null pointer by setting the value to null/undefined
ptr.value = null; 

// Trying to update the value of a null pointer will throw an error
ptr.value = 2;

// Trying to dereference a null pointer will throw an error
const value = ptr.dereference();
```

Naytive tries to prevent null pointer dereference by checking if the pointer is null before dereferencing it. This may not crash your program, but since this is an error, you may not get the expected result.

### Buffer Overflow

A buffer overflow occurs when you write more data to a piece of memory than it can hold. This can potentially corrupt adjacent memory and lead to undesirable behavior, crashes, or security vulnerabilities

```ts
const buffer: Pointer<int> = memory.allocate(1); // allocate 8 bits/1 byte of memory

// Writing more data than the buffer can hold will throw an error
buffer.value = 1234567890; // 32-bits/4 bytes
```

Naytive will try to catch buffer overflows by checking the size of the buffer before writing to it and will try to allocate more memory if the buffer is too small. Note that this only works for values that the native compiler can determine the size of. So you may still get a buffer overflow error if you try to write a value that is too large.

### Memory Leaks

A memory leak occurs when you allocate memory but forget to free it. This can lead to your program using more and more memory over time, eventually causing it to crash. Naytive tries to prevent memory leaks by automatically freeing memory when a pointer goes out of scope. However, if you manually manage memory using the `memory.unsafe` type, you will need to free the memory yourself:

```ts
const a = 1;

for (let i = 0; i < 100; i++) {
  const ptr: Pointer<int> = memory.unsafe(a);

  // do something with the pointer
  // memory is not freed, even when the pointer goes out of scope
  // loop creates 100 memory leaks which can cause your program to crash
}
```

Naytive will always try to free memory when a pointer goes out of scope, even if it is an `UnsafePointer`. However, we still recommend freeing memory manually to prevent memory using `ptr.dereference()` or `ptr.destroy()` wherever possible.

### Dangling Pointers

A dangling pointer is a pointer that continues to point to a memory location that has been freed. Accessing or manipulating memory through a dangling pointer can lead to undefined behavior, including crashes, data corruption, and security vulnerabilities.:

```ts
const a = 3;
const ptr: Pointer<int> = memory.pointer(a);

// free the memory
const value = ptr.dereference();

// trying to access the memory through the pointer will throw an error
ptr.value = 2;
```

Naytive tries to prevent dangling pointers by automatically freeing memory when a pointer goes out of scope and setting null pointers, however, it is still possible to create dangling pointers and other memory errors if you are not careful with UnsafePointers.

## For C/C++ Developers

If you're coming from a C/C++ background, you'll find Naytive's memory management system to be quite similar to what you're used to. Naytive's pointers and memory allocation functions are designed to be familiar to C/C++ developers, so you should feel right at home, however, we encourage you to think of Naytive as a new language and not try to apply C/C++ practices directly to Naytive. Eg: you would use pointers for arrays in C/C++ but in Naytive arrays are first-class citizens and you don't need to use pointers for them.
