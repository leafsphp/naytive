# Strings

Naytive strings are similar to JavaScript strings, but with some additional features to make them more useful for low-level programming.

## Creating Strings

```typescript
const str = 'Hello, World!';
const str2 = "Hello, World!";
const str3 = `Hello, World!`;
```

## Concatenating Strings

```typescript
const str1 = 'Hello, ';
const str2 = 'World!';

const result = str1 + str2;
```

You can also use the ES6 template literals syntax to concatenate strings:

```typescript
const str1 = 'Hello, ';
const str2 = 'World!';

const result = `${str1}${str2}`;
```

## Numbers and Strings

Strings can be concatenated using the `+` operator, but be careful when using numbers:

```typescript
const num = 42;
const str = 'The answer is ' + num;
```

In C/C++, this would be a compile-time error, but in TypeScript, it is allowed. However, it is generally not recommended to mix numbers and strings in this way, as it can lead to unexpected results. Since Naytive is designed to be a replacement for C/C++, it is recommended to follow the same best practices when writing low-level code.

Naytive will try to convert the number to a string when concatenating, but it is always better to be explicit about the conversion:

```typescript
const num = 42;
const str = 'The answer is ' + num.toString();
```

## String Length

You can get the length of a string using the `length` property:

```typescript
const str = 'Hello, World!';

const len = str.length;
```

## Accessing Characters

You can access individual characters in a string using array notation:

```typescript
const str = 'Hello, World!';

const first_char = str[0];
const last_char = str[str.length - 1];
```

## Substrings

You can extract a substring from a string using the `substring` method:

```typescript
const str = 'Hello, World!';

const sub = str.substring(7, 12);
```

This will extract the substring `'World'` from the original string.

## User Input

You can read user input from the console using the `std.cin` function:

```typescript
import { std } from 'naytive';

const name = std.cin();
```

This will read a line of text from the console and return it as a string. `std.cin` is a blocking function, so the program will wait until the user enters a line of text before continuing.

*Note: In C/C++ `cin()` considers a space (whitespace, tabs, etc) as a terminating character, which means that it can only store a single word (even if you type many words). Eg: If you type "John Doe", it will only store "John". Naytive's `std.cin` function does not have this limitation.*

```typescript
import { std } from 'naytive';

...

std.cout('Enter your name: ');

const name = std.cin();

std.cout(`Hello, ${name}!\n`);  // If you enter "John Doe", it will only print "Hello, John Doe!"
```
