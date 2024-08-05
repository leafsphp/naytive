# Pointers (WIP)

Pointers are a powerful feature in Naytive that allows you to directly access memory addresses. They allow direct manipulation of memory and are essential for dynamic memory allocation and handling complex data structures.

![image](https://github.com/user-attachments/assets/368c8377-a762-4945-9f61-eef1b06edd54)

Naytive provides a `Pointer` type and a memory object that allows you to work with pointers:

```ts
const num = 1;
const ptr: Pointer<int> = memory.pointer(num);
```

**Note that all Naytive pointers are smart pointers, meaning that they automatically manage memory for you.** If you want to manually manage memory, you can use the `UnsafePointer` type with the `memory.unsafe` function:

```ts
const num = 1;
const ptr: Pointer<int> = memory.unsafe(num);
```

Either way, this creates a pointer to the memory address of the variable `num`. You can then use the pointer to read and write to the memory address:

```ts
// update the pointer value
ptr.value = 2;

// dereference the pointer to get the value
const value = ptr.dereference();
```

You can also increment and decrement the pointer to move it to a different memory address:

```ts
// increment the pointer
ptr.increment();

// decrement the pointer
ptr.decrement();
```

Naytive also comes with a built-in method for getting the memory address of a variable:

```ts
const num = 1;
const address = memory.address(num);
```

## Manual Memory Management

Although Naytive handles a ton of things for you, there are still situations where you need direct access to memory. For this, you need manual memory management.

### Allocating memory

You can allocate memory using the `allocate` method:

```ts
const ptr: Pointer<int> = memory.allocate(4);
```

This allocates 4 bytes of memory and returns a pointer to the allocated memory. You can then use the pointer to read and write to the memory address:

```ts
ptr.value = 2;
const value = ptr.dereference();
```

As mentioned, Naytive will automatically free the memory when you call the `derefence` method. All the pointer methods are available for manual memory management as well:

```ts
ptr.value;
ptr.increment();
ptr.decrement();
ptr.dereference();
ptr.destroy();
```

### Unsafe Pointers

As mentioned, Naytive provides an `UnsafePointer` type for manual memory management. This type allows you to perform unsafe operations such as reading and writing to arbitrary memory addresses:

```ts
const a = 1;
const ptr: Pointer<int> = memory.unsafe(a);

ptr.value = 2;

const value = ptr.dereference();
```

**Use caution when working with unsafe operations, as they can lead to memory corruption and other issues.** Naytive tries to prevent unsafe operations as much as possible, but they are sometimes necessary for low-level programming. To ensure safety, Naytive will try to free the memory when the pointer is dereferenced instead of waiting till the pointer goes out of scope. If you want to get the pointer value without freeing the memory, you can use the `value` property:

```ts
const value = ptr.value;
```

Note that using this property will not free the memory, so you will need to manually free the memory using the `destroy` method:

```ts
ptr.destroy();
```

## Double Pointers

Naytive also supports double pointers, which are pointers to pointers. This allows you to create complex data structures and perform dynamic memory allocation. You can create a double pointer using the `Pointer` type:

```ts
const num = 1;
const ptr: Pointer<int> = memory.pointer(num);
const ptr2: DoublePointer<int> = memory.pointer(ptr);
```

You can then use the double pointer to access the value of the pointer:

```ts
const value = ptr2.value;
```

## Shared pointers

Naytive also supports shared pointers, which are pointers that share ownership of the memory they point to. This allows you to pass pointers around without worrying about memory leaks. You can create a shared pointer using the `SharedPointer` type:

```ts
const num = 1;
const ptr: Pointer<int> = memory.pointer(num);

// create a shared pointer
const sharedPtr: SharedPointer<int> = memory.sharedPointer(ptr);
```

Shared pointers can be copied and moved around without worrying about memory leaks. Naytive will automatically free the memory when the last shared pointer goes out of scope.

### Automatic pointer ownership

Naytive uses the concept of responsible and irresponsible pointers to make sure you don't accidentally free memory that is still being used.

Responsible pointers are pointers that have direct ownership over the memory they point to. When a responsible pointer goes out of scope, Naytive will automatically free the memory it points to.

Irresponsbile pointers are pointers that don't have direct ownership over the memory they point to. This is useful when you want to share memory between multiple pointers. When an irresponsible pointer goes out of scope, Naytive will not free the memory it points to.

Naytive also allows you to create memory observers that can be used to monitor shared pointers, check if they've been freed or not without causing a segmentation fault.

```ts
const num = 1;
const ptr: Pointer<int> = memory.pointer(num);

// create a memory observer
const observer = memory.observer(ptr);

// access pointer value using observer
const value = observer.value;

console.log(value);

// destroy the pointer using the observer
observer.destroyPointer();

// check if the memory has been freed
if (observer.isPointerDesctroyed()) {
  console.log('Memory has been freed');
}
```

## Conclusion

Now that we've looked at all of this, you should know that Naytive handles a ton of memory related activities for you under the hood. Naytive's clean and simple syntax takes out a lot of reasons you would need to manually manage memory, but it's still good to know how to do it when you need to.

Naytive's memory management system is designed to be as efficient and safe as possible, but it's always good to be aware of the potential pitfalls and how to avoid them.
