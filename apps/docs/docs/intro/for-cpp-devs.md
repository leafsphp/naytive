# Naytive for C/C++ Devs

<!-- ![image](https://github.com/user-attachments/assets/a3cb651d-48d2-4b68-bab4-7f28bd0799cf) -->

The goal of this section is to help C/C++ developers understand how Naytive works and how they can use it to write low-level code in TypeScript. Coming from a C/C++ background, you may be used to writing code that interacts with the operating system, hardware, and other low-level components. Naytive allows you to do all of this in TypeScript, while still reaping all the benefits of a low-level language with as few complexities as possible, however, **_the first step is to think in Naytive, not C/C++._**

![image](https://github.com/user-attachments/assets/209604d3-3a3e-44d3-a805-49886f7ec59f)

## Getting started

To get started with Naytive, you need a basic familiarity with TypeScript. If you're new to TypeScript, you can learn more about it [here](https://www.typescriptlang.org/). If you're familiar with JavaScript, TypeScript is a superset of JavaScript that adds static typing and other features to the language, you can pick it up pretty quickly.

That's pretty much all you need to know to get started with Naytive. If you're a C/C++ developer, you'll get the hang of it pretty quickly. Naytive is designed to be a simple interpretation of C/C++ in TypeScript, so you should feel right at home.

## Differences between Naytive and C/C++

Although Naytive shares many of C/C++ concepts, there are some huge differences between the two languages. Here are some of the key differences:

- **TypeScript is a high-level language**: To be fair, C++ is also a high-level language, but it doesn't look that way compared to the languages we have today. TypeScript is designed to be easy to read and write. This means a whole lot of things are abstracted away from you, which can be a good thing or a bad thing depending on your perspective. An example of this is how there are a bunch of different number types in C/C++ (int, long, short, etc.), but in TypeScript, there is only one main number type. Naytive has the ability to use TypeScript's native types, but also provides C/C++ types for those who prefer them.

- **Modern C++ features**: Modern C++ features are designed to make your code more readable and maintainable. Naytive has a lot of these features built-in, such as classes, interfaces, arrays, and more. This means that you can write more readable and maintainable code in Naytive than you can in C/C++. For users of C and older versions of C++, you might need to learn some new ways of doing things, like creating arrays directly instead of using pointers.

- **Type Inference**: TypeScript has a feature called type inference, which means that you don't always have to specify the type of a variable. TypeScript will automatically infer the type of a variable based on the value that you assign to it. This can save you a lot of time and make your code more readable. Naytive has this feature as well to an extent, but it is not as powerful as TypeScript's, so we still recommend specifying types when you can.

- **Automatic Memory Management**: Naytive has automatic memory management, which means that you don't have to worry about allocating and freeing memory manually. This can save you a lot of time and make your code more readable. However, if you're used to managing memory manually in C and older versions of C++, you might find this feature a bit strange at first.

- **Includes and Imports**: In C/C++, you use `#include` to include header files, and in TypeScript, you use `import` to import modules. Naytive supports both imports of TypeScript modules and C/C++ header files, so you can use whichever one you prefer, however, you still need to use the import syntax to do this. eg:
  
  ```ts
  import { myAwesomeFunction } from './my_application.h';
  ```

- **Friendlier Standard Library**: Naytive does not share the C/C++ standard library, which means that you can't use functions like `printf` or `scanf`. Instead, Naytive provides its own standard library that is designed to be simple and efficient. You can still do all of the things you did in C/C++, just in a different way.

## Thinking in Naytive

Thinking in Naytive means thinking in TypeScript. You can keep your C/C++ knowledge in the back of your mind, but you should try to think in TypeScript as much as possible. This means using TypeScript's native types, classes, interfaces, and other features as much as possible. This will help you write more readable and maintainable code that is easier to understand and debug. Naytive is meant to be simple, so if you find yourself writing complex code, you might be doing something wrong.

## Example

Here is a simple example that requests the user's first name and then greets them:

```typescript
import { std } from '@naytive/core';
import type { int } from '@naytive/types';

function main(): int {
  const first_name: string = std.cin('Enter your first name: ');

  std.cout(`Hello, ${first_name}!\n`);
  std.cout('Welcome!');

  return 0;
}
```

Notice how we're using both TypeScript's native types and Naytive's "lower-level types" to write this code. We're also using Naytive's standard library to interact with the console. This is a simple example, but it should give you a good idea of how Naytive works and how you can create something basic. Just like with C/C++, the main function is the entry point of the program, and it returns an integer value.

`int` is a C/C++ type that is used to represent integers. TypeScript does not have a built-in `int` type, so we have to import it from the `@naytive/types` module. This is just one example of how Naytive bridges the gap between TypeScript and C/C++. If you need to use other C/C++ types, you can import them from the `@naytive/types` module as well.

Another thing to note is that we're using TypeScript's native `string` type to represent the user's first name. Note that unlike C/C++, TypeScript has many different ways to represent strings and concatenation, so you might need to learn some new ways of doing things. Over here, we used TypeScript's template literals to concatenate the user's first name with the greeting message. This is just one example of how TypeScript can make your code more readable and maintainable.
