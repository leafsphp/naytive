# Strings

Strings are a sequence of characters, such as letters, numbers, and symbols. In Naytive, strings are represented by the `string` type.

```typescript
const str: string = 'Hello, World!';
```

Note that Naytive doesn't have a `char` type like C/C++. In Naytive, a single character is represented as a string with a length of 1.

![image](https://github.com/user-attachments/assets/36f6761f-38c3-4846-acd1-23d7d7ebb9ea)

To create a string, you can use single quotes (`'`), double quotes (`"`), or backticks (`` ` ``). Single quotes and double quotes are equivalent, but backticks are used for template literals, which allow you to embed expressions inside a string.

```typescript
const str1 = 'Hello, World!';
const str2 = 'Hello, World!';
const str3 = `Hello, World!`;
```

## Multiline String Literals

If you need a string that spans several lines, use a multiline string literal — a sequence of characters surrounded by backticks (`).

```typescript
const str = `This is a
multiline
string`;
```

This will create a string with three lines of text. The newline characters (`\n`) are preserved in the string.

## Special Characters

Strings can contain special characters, such as newline (`\n`), tab (`\t`), and backslash (`\\`). To include a special character in a string, use an escape sequence.

```typescript
const str = 'Hello, \nWorld!';
```

This will create a string with a newline character between `'Hello, '` and `'World!'`.

## Concatenating Strings

String values can be added together (or concatenated) with the addition operator (+) to create a new String value. This is especially useful when you want to combine multiple strings into a single string or when you want to add a string to another value.

```typescript
const str1 = 'Hello, ';
const str2 = 'World!';

const result = str1 + str2;
```

This will create a new string `'Hello, World!'` by concatenating the two strings.

### Numbers and Strings

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

## String Interpolation

String interpolation is a way to construct a new String value from a mix of constants, variables, literals, and expressions by including their values inside a template literal. This is done by using the `${}` syntax inside a template literal.

```typescript
const str1 = 'Hello, ';
const str2 = 'World!';

const result = `${str1}${str2}`;
```

In the above example, the `${}` syntax is used to interpolate the values of `str1` and `str2` inside the template literal. This will create a new string `'Hello, World!'`.

Interpolation is a more concise and readable way to construct strings compared to concatenation, since it allows you to structure the string in a more natural way.

You can also include expressions inside the `${}` syntax:

```typescript
const num = 42;

const str = `The answer is ${num}`;
const str2 = `The answer is ${num + 1}`;
```

This will create a string `'The answer is 42'` and `'The answer is 43'` by interpolating the value of `num` and `num + 1` inside the template literal.

## String Methods

Strings have several built-in methods that allow you to manipulate and work with string values. Some of the most common methods are:

### String Length

You can get the length of a string using the `length` property:

```typescript
const str = 'Hello, World!';

const len = str.length;
```

### Substrings

You can extract a substring from a string using the `substring` method:

```typescript
const str = 'Hello, World!';

const sub = str.substring(7, 12);
```

This will extract the substring `'World'` from the original string.

### Searching

You can search for a substring within a string using the `indexOf` method:

```typescript
const str = 'Hello, World!';
const index = str.indexOf('World');
```

This will return the index of the first occurrence of the substring `'World'` in the original string.

### Replacing

You can replace a substring within a string using the `replace` method:

```typescript
const str = 'Hello, World!';

const new_str = str.replace('World', 'Universe');

console.log(new_str); // 'Hello, Universe!'
```

This will replace the substring `'World'` with `'Universe'` in the original string.

### Case Conversion

You can convert the case of a string using the `toUpperCase` and `toLowerCase` methods:

```typescript
const str = 'Hello, World!';

const upper = str.toUpperCase();
const lower = str.toLowerCase();
```

This will convert the original string to uppercase and lowercase, respectively.

## Accessing Characters

As mentioned earlier, strings are a sequence of characters. You can access individual characters in a string using the array notation:

```typescript
const str = 'Hello, World!';

const first_char = str[0];
const last_char = str[str.length - 1];
```

## Comparing Strings

You can compare two strings using the comparison operators (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`). When comparing strings, Naytive compares them lexicographically, which means that it compares the characters in the strings based on their Unicode values.

```typescript
const str1 = 'apple';
const str2 = 'banana';

if (str1 < str2) {
  console.log('apple comes before banana');
} else if (str1 > str2) {
  console.log('banana comes before apple');
} else {
  console.log('apple and banana are equal');
}

// Output: 'apple comes before banana'
```

Since Naytive uses Unicode for string comparison, lowercase letters come before uppercase letters:

```typescript
const str1 = 'apple';
const str2 = 'Apple';

if (str1 < str2) {
  console.log('apple comes before Apple');
} else if (str1 > str2) {
  console.log('Apple comes before apple');
} else {
  console.log('apple and Apple are equal');
}

// Output: 'Apple comes before apple'
```

If you want to perform a case-insensitive comparison, you can convert both strings to lowercase or uppercase before comparing them:

```typescript
const str1 = 'apple';
const str2 = 'Apple';

if (str1.toLowerCase() < str2.toLowerCase()) {
  console.log('apple comes before Apple');
} else if (str1.toLowerCase() > str2.toLowerCase()) {
  console.log('Apple comes before apple');
} else {
  console.log('apple and Apple are equal');
}

// Output: 'apple and Apple are equal'
```

## User Input

You can read user input from the console using the `std.cin` function:

```typescript
import { std } from 'naytive';

const name = std.cin();
```

This will read a line of text from the console and return it as a string. `std.cin` is a blocking function, so the program will wait until the user enters a line of text before continuing.

_Note: In C/C++ `cin()` considers a space (whitespace, tabs, etc) as a terminating character, which means that it can only store a single word (even if you type many words). Eg: If you type "John Doe", it will only store "John". Naytive's `std.cin` function does not have this limitation._

```typescript
import { std } from 'naytive';

...

const name = std.cin();

std.cout(`Hello, ${name}!\n`);  // If you enter "John Doe", it will only print "Hello, John Doe!"
```

Unlike C/C++, Naytive's `std.cin` function also allows you to prompt the user for input by passing a string argument:

```typescript
import { std } from 'naytive';

const name = std.cin('Enter your name: ');

std.cout(`Hello, ${name}!\n`);
```
