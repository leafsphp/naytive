# Generics

Generics are a powerful feature of TypeScript that allows you to write reusable and flexible code. They allow you to write functions, classes, and interfaces that can work with any data type.

In C++, generics are known as templates, but they are essentially the same concept. Generics allow you to define a function, class, or interface with a placeholder for a data type. This placeholder can then be replaced with any data type when the function, class, or interface is used.

Here is an example of a generic function:

```typescript
function identity<T>(value: T): T {
  return value;
}

const result = identity('hello');
console.log(result); // Output: hello

const numberResult = identity(123);
console.log(numberResult); // Output: 123

const booleanResult = identity(true);
console.log(booleanResult); // Output: true
```

In this example, the `identity` function is a generic function that takes a single argument of type `T` and returns a value of the same type. The `T` placeholder is replaced with the actual data type when the function is called.

You can also use generics with classes and interfaces. Here is an example of a generic class:

```typescript
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const box = new Box('hello');
console.log(box.getValue()); // Output: hello

const numberBox = new Box(123);
console.log(numberBox.getValue()); // Output: 123

const booleanBox = new Box(true);
console.log(booleanBox.getValue()); // Output: true
```

In this example, the `Box` class is a generic class that takes a single type parameter `T`. The `value` property and `getValue` method both use the `T` placeholder to work with any data type.

In the examples above, the `T` placeholder is replaced with the actual data type when the function or class is used, but you can also specify the data type explicitly. Here is an example of specifying the data type explicitly:

```typescript
const result = identity<string>('hello');
console.log(result); // Output: hello
```
