# Introduction

::: warning Early Development
Naytive is in the very early stages of development. It is currently only capable of very limited stuff, but the documentation covers some future expected features. We will mark features that are not yet implemented with a "Coming Soon" tag and will be updating the documentation as we make progress on the project.
:::

Naytive is a fast, lightweight and easy-to-use interface for writing low-level code in TypeScript. It is designed to be a simple and efficient way to replace C/C++ code with more readable and maintainable TypeScript code. This means that you can write all of your intense code in TypeScript, and still reap all the benefits of a low-level language with as few complexities as possible.

We don't really think of Naytive as a full-blown language, but as a bridge that allows you to write TypeScript which is then converted into C/C++ so it can be compiled into machine code. This gives you the best of both worlds: the high-level features of TypeScript and the low-level capabilities of C/C++. We chose TypeScript because it is a popular language that is easy to learn and use, and it has a lot of features that fit right into the model of Naytive.

This opens up a whole new world of possibilities for both TypeScript developers, and developers who are new to low-level programming, as it abstracts away many of the complexities of C/C++ programming, and provides a more approachable syntax for all the heavy-lifting.

*Low-level code doesn't need to be ugly and hard to read. - A Lazy Creator (me 😂).*

![image](https://github.com/user-attachments/assets/f2c3070d-8838-4cf0-a392-82008464027b)

## Example

This is a simple example that requests the user's first name and then greets them:

```typescript
import { std } from '@naytive/core';
import type { int } from '@naytive/types';

export function main(): int {
  const firstName: string = std.cin('Enter your first name: ');

  std.cout(`Hello, ${first_name}!\n`);
  std.cout('Welcome!');

  return 0;
}
```

## Why Build Naytive?

C++ is still the premier language for system-intense work, used all over the world in everything from cars, healthcare, heavy machinery, and even space exploration. But it's not the easiest language to learn, and it's not the easiest language to write in. C++ lacks many of the modern features that make languages like TypeScript easier to use and also has a lot of complexities that can make it hard to write and maintain code. We also recognize that building an entirely new language is a huge undertaking that comes with it's own problems and compromises, and we wanted to build something that could be used right now, with the tools and knowledge that developers already have.

Languages like [Rust](https://www.rust-lang.org/) and [Zig](https://ziglang.org/) solve some of these problems, but they are still relatively new and have a steep learning curve for both users of C/C++ and other high-level languages. There is also the challenge of migrating existing codebases to a new language, which can be a huge undertaking. It is for this reason that we decided to build Naytive as a "translator" of sorts, that allows you to write C/C++ code while reaping the benefits of a powerful high-level language like TypeScript. If you're interested in learning more about how Naytive compares to other languages, check out the [Comparison](/docs/intro/comparison) page.

Once again, Naytive is not a shiny new replacement for C/C++. It's simply a time machine that allows you to write C/C++ code in a more modern and approachable way. Here's what we're working towards:

- 100% compatibility with C/C++: Since it compiles back to C++, Naytive can import and use any C/C++ library, and can be used in any C/C++ project.

- Built-in Safety: Naytive has built-in safety features that prevent common C/C++ bugs like buffer overflows, null pointer dereferences, and memory leaks. (Coming Soon)

- Modern Features: Naytive has modern features like classes, interfaces, arrays, and more that make your code more readable and maintainable. (Coming Soon)

- Automatic Memory Management: Naytive has automatic memory management, which means that you don't have to worry about allocating and freeing memory manually. (Coming Soon)

- Memory Light: Naytive prioritizes memory efficiency over everything else, so you can write code that runs fast and uses as little memory as possible.

- Easy to Learn: Naytive is designed to be easy to learn and use, so you can start writing your next project in Naytive right away.

Overall, Naytive is designed to be SIMPLE, CLEAN, SAFE and READABLE. It is a new way to write C/C++ without actually writing C/C++. Let's leave you with a meme to sum it all up:

![image](https://github.com/user-attachments/assets/388b01c6-a688-4d75-8732-3f671681f744)
