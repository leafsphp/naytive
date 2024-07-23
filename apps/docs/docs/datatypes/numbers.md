# Naytive Numbers

![image](https://github.com/user-attachments/assets/cede7f89-b48c-498b-97db-0abb6cc2d85f)

Yes this isn't Python, but just like Python, TypeScript has a built-in `number` type that can represent both whole numbers and fractional numbers. This is a high-level data type that is easy to use and understand, but it is not well-suited for writing low-level code.

Naytive has support for the high-level `number` type, but it recommended to only use it when Naytive can infer the type. For example, when you write `let x: number = 42;`, Naytive will infer that `x` is of type `int`. However, if you want to be explicit about the type, you can use Naytive's low-level data types like `int`, `float`, and `double`.

## Using Naytive Numbers

Naytive has custom number types which are just ports of C/C++ data types. To get started with these typesm you need to import them from the `@naytive/types` module:

```ts
import type { int, float, double } from '@naytive/types';

let i: int = 42;
let f: float = 3.14;
let d: double = 3.141592653589793;
```

## Available Number Types

Before we get into the different number types that Naytive supports, it's important to understand the difference between whole numbers and fractional numbers. Whole numbers are numbers without decimals, while fractional numbers are numbers with decimals.

Another important concept to understand is the difference between signed and unsigned numbers. Signed numbers can be positive or negative, while unsigned numbers can only be positive. This is important when working with low-level code, as it determines the range of values that a number can represent.

Now that we have covered the basics, let's take a look at the different number types that Naytive supports:

- `short`: A whole number, without decimals. This is a 16-bit signed integer.
- `u_short`: A whole number, without decimals. This is a 16-bit unsigned integer.
- `int`: A whole number, without decimals. This is a 32-bit signed integer.
- `u_int`: A whole number, without decimals. This is a 32-bit unsigned integer.
- `long`: A whole number, without decimals. This is a 32-bit signed integer.
- `u_long`: A whole number, without decimals. This is a 32-bit unsigned integer.
- `longlong`: A whole number, without decimals. This is a 64-bit signed integer.
- `u_longlong`: A whole number, without decimals. This is a 64-bit unsigned integer.
- `float`: A fractional number, containing one or more decimals. This is a 32-bit floating-point number.
- `double`: A fractional number, containing one or more decimals. This is a 64-bit floating-point number.

Note that memory sizes of variables bigger than a `short` differ based on the platform you are running Naytive on. For example, a `int` on a 32-bit system is 16 bits, while on a 64-bit system it is 32 bits. This is important to keep in mind when working with low-level code, as it determines the range of values that a number can represent.

## Infering Number Types

As mentioned, Naytive can infer the type of a number based on the value that is assigned to it. This makes it easier to write code and reduces the amount of boilerplate that you need to write. Here are some examples of how Naytive infers the type of a number:

```ts
let i = 42; // i is inferred as a short
let f = 3.14; // f is inferred as float
let d = 3.141592653589793; // d is inferred as double

let s: short = 4; // s is explicitly set as short
let l: long = 800009; // l is explicitly set as long
```

Or even with TypeScript's built-in `number` type:

```ts
let n: number = 42; // n is inferred as short
```

## Number Methods

Naytive provides a number of built-in methods that you can use to perform operations on numbers. Here are some of the most commonly used methods:

### `toString()`

The `toString()` method converts a number to a string:

```ts
const num = 42;

const str = num.toString(); // str is '42'
```

### `toFixed()`

The `toFixed()` method formats a number using fixed-point notation:

```ts
const num = 3.141592653589793;

const str = num.toFixed(2); // str is '3.14'
```
