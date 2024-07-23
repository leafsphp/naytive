# Naytive Data Types

Since Naytive is built to be a low-level language, it has all the basic data types that you would expect from a language like C/C++. These data types are used to represent different kinds of values, such as numbers, characters, and pointers. For simplicity, Naytive also supports TypeScript's built-in data types, such as `string`, `number`, and `boolean`, which can be used interchangeably with Naytive's data types.

## Type Safety

Type safety is an important concept in programming that ensures that the data types of variables are used correctly. By using the right data types for the right job, you can avoid bugs and errors in your code. Naytive is a statically typed language, which means that the data types of variables are checked at compile time. This allows Naytive to catch errors early and provide better performance and security.

For example, if you try to assign a number to a string variable, Naytive will throw a compile-time error:

```ts
let s: string = 'This is a string';

s = 42; // Error: Type 'number' is not assignable to type 'string'
```

Without type safety, you'll have situations like this:

![image](https://github.com/user-attachments/assets/32a93afe-ac5f-451f-86ee-bb44ed497101)

Let's take a look at the basic data types that Naytive supports, and how you can use them in your code.

## C/C++ Types

Here are the basic data types that Naytive ships with, which are similar to C/C++ data types:

- `char`: A single character/letter/number, or ASCII values.
- `bool` or `boolean`: A boolean value, either `true` or `false`.
- `int`: A whole number, without decimals.
- `float`: A fractional number, containing one or more decimals. Sufficient for storing 6-7 decimal digits.
- `double`: A fractional number, containing one or more decimals. Sufficient for storing 15 decimal digits.

These are the basic data types that you will be using most often in Naytive, but Naytive also supports C data types like `short`, `long`, `longlong`, `uint`, and `longdouble`. These data types are used to represent different sizes and signedness of integers, and are useful when working with low-level code.

To use these data types in Naytive, you can simply import them from the `@naytive/types` module since they don't ship with TypeScript out of the box:

```ts
import { char, bool, int, float, double, number } from '@naytive/types';

...

let c: char = 'a';
let b: bool = true;
let i: int = 42;
let f: float = 3.14;
let d: double = 3.141592653589793;
let s: short = 4;
let l: long = 800009;
let ld: longdouble = 3.14159265358979323846;
```

## TypeScript Types

TypeScript is a high-level language that is designed to be easy to use and understand. It has built-in data types that abstract all the detailed types we described above. These data types are used to represent different kinds of values, such as numbers and characters. For simplicity, Naytive also supports TypeScript's built-in data types, such as `string`, `number`, and `boolean`, which can be used interchangeably with Naytive's data types.

If you're coming from a C/C++ background, you might find this to be very weird, but with fewer data types to worry about, you can focus on writing code that is more readable and maintainable. Here are some of the TypeScript data types that you can use in Naytive:

- `string`: A sequence of characters, enclosed in quotes.
- `number`: A whole number or a fractional number, without decimals.
- `boolean`: A boolean value, either `true` or `false`.
- `undefined`: A value that is not defined.
- `null`: A value that is explicitly set to `null`.
- `void`: A value that is not returned from a function.

Besides these basic types, there are more common types like `Array` which are used to represent more complex data structures and functions, and are useful when working with high-level code. Since these types are built-in, there is no need to import them from a module:

```ts
let s: string = 'Hello, World!';
let n: number = 42;
let b: boolean = true;
let u: undefined = undefined;
let nu: null = null;
let v: void = undefined;
let a: Array<number> = [1, 2, 3, 4, 5];
```

## Type Inference

Type inference is a powerful feature of TypeScript that allows you to write code without explicitly specifying the data types of variables. TypeScript will automatically infer the data type of a variable based on the value that is assigned to it. This makes it easier to write code and reduces the amount of boilerplate that you need to write.

Naytive also supports type inference, but in a very limited manner. Since Naytive is a low-level language, it is important to specify the data types of variables explicitly to avoid any confusion or errors. However, you can still use type inference in Naytive for simple cases where the data type can be easily inferred:

```ts
let s = 'Hello, World!'; // Naytive will infer the type as `string`
let n = 42; // Naytive will infer the type as `int`
let f = 3.14; // Naytive will infer the type as `float`
let d = 3.141592653589793; // Naytive will infer the type as `double`
```

Not only does this make the code more flexible and easier to read, but it also allows Naytive to optimize the code better since it knows the exact data type of each variable. This can lead to faster and more efficient code, which is important when working with low-level code. For example, we mentioned that `n = 42` will be inferred as `int`, however, the Naytive compiler will optimize it to `unsigned short` if it can fit in that data type. This may not seem like a big deal, but when you're working with thousands or millions of variables, these optimizations can add up and make a big difference in performance.

## Conclusion

Data types are an essential part of any programming language, and Naytive is no exception. By understanding the basic data types that Naytive supports, you can write code that is more efficient and easier to read. Naytive also supports TypeScript's built-in data types, which makes it easier to write high-level code that interacts with low-level components. By using the right data types for the right job, you can write code that is more reliable and easier to maintain.
