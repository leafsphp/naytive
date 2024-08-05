# Naytive Tour

Hey there! Welcome to the Naytive tour. In this tour, we'll take a look at the Naytive syntax and its features. We'll cover everything from basic data types to advanced concepts like classes and modules. Let's get started!

<!-- ![image](https://github.com/user-attachments/assets/7337099c-aba0-4bd6-8d71-759ec6621e98) -->
![image](https://github.com/user-attachments/assets/4db772d8-abfc-4809-9b25-255bb8fae65c)

## Hello, World

We've all written a "Hello, World" program at some point in our programming journey. Here's how you can do it in Naytive:

```ts
console.log('Hello, World!\n');
```

This code snippet prints "Hello, World!" to the console. The `console.log()` function is a built-in JavaScript method used to output text to the console. Although it is not a part of the Naytive standard library, it is still treated as a built-in function in Naytive.

The `\n` character is a newline character that moves the cursor to the next line. This is a simple example, but it demonstrates how easy it is to write code in Naytive.

If you are familiar with C/C++, this must look very weird to you since C/C++ both require an entry function. Naytive does not require an entry point, but it is still recommended to use one. Here's how you can write a "Hello, World" program with a `main` function:

```ts
import type { int } from '@naytive/types';

function main(): int {
  console.log('Hello, World!\n');

  return 0;
}
```

This program imports the `int` type from `@naytive/types`, defines a `main` function that prints "Hello, World!" to the console, and returns `0` to indicate successful execution. You may be wondering why we're importing the `int` type.

This is because TypeScript is a high-level language and doesn't have built-in low-level types like `int`, `char`, etc. Naytive provides these low-level types through the `@naytive/types` package.

Remember that `main()` is a special function in Naytive that serves as the entry point for your program. Of course, this is all for formality. TypeScript on its own has no concept of an entry point function, so you can think of `main()` as a convention rather than a requirement.

## Simple Values

Creating variables in Naytive is straightforward. You can use the `let`/`var` keywords to declare a variable and assign a value to it. You can also use `const` to declare a constant variable. Here's an example:

```ts
var myVariable = 42;
myVariable = 50;

let myVariable2 = 42;
myVariable2 = 50;

const myConstant = 42;
myConstant = 50; // Error: Cannot assign to 'myConstant' because it is a constant.
```

A constant or variable must have the same type as the value you want to assign to it. However, you don’t always have to write the type explicitly. Providing a value when you create a constant or variable lets the compiler infer its type. In the example above, the compiler infers that myVariable is an integer because its initial value is an integer.

If the initial value doesn’t provide enough information (or if there isn’t an initial value), specify the type by writing it after the variable, separated by a colon.

```ts
import type { int, short, float, double } from '@naytive/types';

let implicitShort = 70;
let explicitShort: short = 70;

let implicitInt = 700;
let explicitInt: int = 700;

let implicitFloat = 70.0;
let explicitFloat: float = 70.0;

let implicitDouble = 3.14159265359;
let explicitDouble: double = 3.14159265359;
```

In this example, we declare variables with implicit and explicit types. The `int`, `short`, `float`, and `double` types are provided by the `@naytive/types` package. These types are low-level types that map to their C/C++ counterparts. Note that Naytive will always try to assign the most memory-efficient type to a variable. That is why `implicitShort` is assigned a `short` type instead of an `int` type and `implicitFloat` is assigned a `float` type instead of a `double` type. This is done to save memory and improve performance, however, you can always explicitly specify the type if you want.

## Types

You have already seen how to add types to variables. Naytive provides a range of ported C/C++ types in addition to the built-in TypeScript types. One thing to note about typed variables is that they cannot be reassigned to a value of a different type. Here's an example:

```ts
import type { int } from '@naytive/types';

let myInt: int = 42;
myInt = 50; // OK

myInt = '50'; // Error: Type 'string' is not assignable to type 'int'.
```

Values are never implicitly converted to another type. If you need to convert a value to a different type, explicitly make an instance of the desired type.

```ts
import type { int } from '@naytive/types';

const myInt: int = 42;

const myString: string = myInt.toString(); // 42 -> '42'
```

TypeScript out of the box allows addition of numbers and strings, but Naytive does not. This is because Naytive is designed to be a replacement for C/C++, and in C/C++, adding a number to a string is a compile-time error. However, Naytive will try to convert the number to a string when concatenating, but it is always better to be explicit about the conversion.

```ts
import type { int } from '@naytive/types';

const num: int = 42;

const str: string = 'The answer is ' + num.toString();
```

An even simpler way to do this is to use string interpolation:

```ts
import type { int } from '@naytive/types';

const num: int = 42;

const str: string = `The answer is ${num}`;
```

## Arrays

Arrays are a way to store multiple values in a single variable. TypeScript provides a built-in array type that you can use to create arrays. Here's an example:

```ts
import type { int } from '@naytive/types';

const myArray: int[] = [1, 2, 3, 4, 5];
```

If you are from a C/C++ background, you may be wondering why we are using `int[]` instead of `int*`. This is because arrays are first-class citizens in TypeScript, and Naytive provides a high-level array type that is similar to the C++ `std::vector` type. Arrays created this way are flexible and can grow or shrink in size as needed.

```ts
import type { int } from '@naytive/types';

const myArray: int[] = [1, 2, 3, 4, 5];
myArray.push(6); // perfectly fine
```

If you are worried about performance, don't be. Naytive arrays are optimized for performance and memory usage. Naytive will always try to allocate the least amount of memory possible for an array based on the type of elements in it. If you want to allocate a fixed-size array, you can do so by using Naytive's fixed-size array type:

```ts
import type { array, int } from '@naytive/types';

const myFixedArray: array<int, 5> = [1, 2, 3, 4, 5];
myFixedArray.push(6); // Error: Not enough space in the array.
```

In this example, we declare a fixed-size array of integers with a size of 5. Naytive will allocate exactly 5 integers for this array, and you cannot add more elements to it. This is useful when you know the size of the array at compile time and want to avoid dynamic memory allocation.

## Objects/Structs (WIP)

Objects are a way to store key-value pairs in Naytive. If you are from a C/C++ background, you may be familiar with structs. Naytive objects are similar to C++ structs, but with a more flexible syntax. TypeScript provides a built-in object type that you can use to create objects. Here's an example:

```ts
import type { int } from '@naytive/types';

const myObject: { x: int; y: int } = { x: 10, y: 20 };

// or using the type keyword
type Point = { x: int; y: int };
const myObject: Point = { x: 10, y: 20 };
```

We called them objects here, but Naytive objects work more like C++ structs which is why we will refer to them as `structs` to distinguish them from JavaScript objects.

In this example, we define a struct named `Point` with two properties `x` and `y`, both of type `int`. We then create an instance of this struct into the variable `myObject`  with values `x: 10` and `y: 20`.

Naytive structs are strict: you cannot add or remove properties from an object once it is defined. This is because Naytive objects are designed to be low-level and efficient, and adding or removing properties at runtime can lead to performance issues.

If you need to be able to add or remove properties from an object, you can tell Naytive to allow it by using the `Record` type:

```ts
import type { int } from '@naytive/types';

const myObject: Record<string, int> = { x: 10, y: 20 };

myObject.z = 30; // perfectly fine
```

In this example, we define an object `myObject` with properties `x` and `y` of type `int`. We then add a property `z` to the object at runtime. This is useful when you need to work with dynamic objects that can change shape during runtime.

This is more costly in terms of performance and memory usage, so use it only when necessary.

## Functions

Functions are blocks of code that perform a specific task. Naytive functions are similar to C++ functions, but with a more expressive syntax. To declare a function in Naytive, you use the `function` keyword followed by the function name, parameters, and return type. Here's an example:

```ts
function greet(name: string): void {
  console.log(`Hello, ${name}!\n`);
}
```

In this example, we define a function `greet` that takes a `name` parameter of type `string` and returns `void`. The function prints a greeting message to the console with the name provided.

TypeScript also allows you to define arrow functions, which are a more concise way to write functions. You can take them as TypeScript's version of C++ lambdas. Here's an example:

```ts
const greet = (name: string): void => {
  console.log(`Hello, ${name}!\n`);
};
```

Here, we define a variable named `greet` and assign an arrow function to it. The arrow function takes a `name` parameter of type `string` and returns `void`. The function prints a greeting message to the console with the name provided.

No matter which syntax you choose, Naytive functions are used the same way. You can call a function by using its name followed by parentheses and passing any required arguments. Here's an example:

```ts
greet('World'); // Hello, World!
```

This code snippet calls the `greet` function with the argument `'World'`, which prints `Hello, World!` to the console.

Naytive functions can also be nested inside other functions. This is useful when you need to encapsulate functionality within a specific scope. Here's an example:

```ts
function outerFunction(): void {
  const valueInOuterFunction = 42;

  function innerFunction(): void {
    console.log(`Hello from inner function!`);
    console.log(`valueInOuterFunction: ${valueInOuterFunction}\n`);
  }

  innerFunction();
}

outerFunction();
```

In this example, we define an `outerFunction` that contains an `innerFunction`. The `innerFunction` has access to the variables defined in the `outerFunction`, which is known as lexical scoping. When you call the `outerFunction`, it calls the `innerFunction`, which prints a message to the console.

Since Naytive functions are first-class citizens, you can return a function from another function. This is known as a higher-order function. Here's an example:

```ts
function createGreeter(greeting: string): (name: string) => void {
  return (name: string): void => {
    console.log(`${greeting}, ${name}!\n`);
  };
}

const greet = createGreeter('Hello');

greet('World'); // Hello, World!
```

In this example, we define a function `createGreeter()` that takes a `greeting` parameter of type `string` and returns an arrow function that takes a `name` parameter of type `string` and returns `void`. The returned function prints a greeting message to the console with the provided `greeting` and `name`. Note that the returned function has access to the `greeting` parameter of the `createGreeter()` function.

You can also pass functions as arguments to other functions. This is known as a callback function. Here's an example:

```ts
function doSomething(callback: () => void): void {
  console.log('Doing something...');
  callback();
}

function logMessage(): void {
  console.log('Message logged!\n');
}

doSomething(logMessage);

// or

doSomething(() => {
  console.log('Message logged!\n');
});
```

## Control Flows

Control flow statements are used to control the flow of a program. Naytive provides a range of control flow statements that you can use to make decisions, loop over code blocks, and more. Here are some examples:

```ts
import { std } from '@naytive/core';
import type { int, array } from '@naytive/types';

...

const myNumbers: array<int, 5> = [10, 20, 30, 40, 50];

if (myNumbers.length > 0) {
  for (let i = 0; i < myNumbers.length; i++) {
    std.cout(`${myNumbers[i].toString()}\n`);
  }
} else {
  std.cout('No numbers to display.\n');
}

myNumbers.forEach((num: int, index: int, array: int[]) => {
  std.cout(`${num} - ${index}\n`);

  array.forEach((aNumber) => {
    std.cout(`${index} -> ${aNumber}\n`);
  });
});
```

Over here, we see an array defined with 5 integers. We then check if the array has any elements. If it does, we loop over the array using a for loop and print each element to the console. If the array is empty, we print a message saying there are no numbers to display.

For the second part, we use the `.forEach()` method to loop over the array. The `forEach()` method takes a callback function as an argument, which is called for each element in the array. The callback function takes three arguments: the current element, the index of the current element, and the array itself.

We can also call `.map()` on the array to create a new array with the results of calling a provided function on every element in the array. Here's an example:

```ts
import { std } from '@naytive/core';

const myNumbers = [1, 2, 3, 4, 5];

const doubledNumbers = myNumbers.map((num: number) => num * 2);
```

In this example, we define an array `myNumbers` with five elements. We then call the `.map()` method on the array and pass an arrow function that doubles each element. The `.map()` method returns a new array `doubledNumbers` with the doubled values.

Notice the function we passed into `(num: number) => num * 2`. This is equivalent to:

```ts
(num: number) => {
  return num * 2;
}
```

This is a concise way to write functions in TypeScript. If the function body is a single expression, you can omit the curly braces and the `return` keyword. The expression after the arrow `=>` is implicitly returned.

Other control flow statements include `switch` statements, ternaries and pretty anything you are used to. You can use these statements to create more complex control flows in your Naytive programs.

```ts
const day = 'Monday';

switch (day) {
  case 'Monday':
    std.cout('It\'s Monday!\n');
    break;
  case 'Tuesday':
    std.cout('It\'s Tuesday!\n');
    break;
  case 'Wednesday':
    std.cout('It\'s Wednesday!\n');
    break;
  default:
    std.cout('It\'s not Monday, Tuesday, or Wednesday!\n');
}
```

## Modules

Modules are a way to organize code in Naytive. A module is a file that contains related code. Naytive uses the CommonJS module system, which allows you to import and export code between modules. Here's an example of how you can create and use modules in Naytive:

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}
```

In this example, we define a module `math.ts` that exports two functions `add` and `subtract`. The `add` function takes two parameters `a` and `b` of type `number` and returns their sum. The `subtract` function takes two parameters `a` and `b` of type `number` and returns their difference.

To use the `math` module in another file, you can import it like this:

```ts
// main.ts
import { add, subtract } from './math';

const result1: int = add(10, 5); // 15
const result2: int = subtract(10, 5); // 5
```

Here, we import the `add()` and `subtract()` functions from the math.ts module and use them in the `main.ts` file. The `add` function adds two numbers `10` and `5`, and the `subtract` function subtracts `5` from `10`.

If you have a C/C++ background, you may be wondering why we are using `import` and `export` instead of `#include` and `extern`. This is because Naytive is built on top of TypeScript, which uses the CommonJS module system for importing and exporting code. This system is more flexible and powerful than the C/C++ `#include` system, allowing you to import and export specific functions, variables, and classes from modules.

You can also import C/C++ libraries and files using the `import` statement. Naytive will automatically plugin-in the C/C++ code to TypeScript and include it in your project. This allows you to use existing C/C++ libraries and code in your Naytive projects without having to rewrite them in TypeScript.

```ts
import { functionName } from 'path/to/c++/file.h';
```

or

```ts
import { functionName } from '<c-library-name>';
```

This is important because Naytive does not have an implementation of every C/C++ library, so you may need to use existing C/C++ libraries in your Naytive projects. Unfortunately, you will have no type information for these libraries, so you will have to rely on the original C/C++ documentation to understand how to use them.
