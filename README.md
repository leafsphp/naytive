<!-- markdownlint-disable no-inline-html -->
<p align="center">
  <br><br>
  <img src="https://avatars.githubusercontent.com/u/89473452?s=200&v=4" height="100"/>
</p>

<h1 align="center">Naytive JS</h1>

<p align="center">
	<a href="https://packagist.org/packages/leafs/hanabira"
		><img
			src="https://poser.pugx.org/leafs/hanabira/v/stable"
			alt="Latest Stable Version"
	/></a>
	<a href="https://packagist.org/packages/leafs/hanabira"
		><img
			src="https://poser.pugx.org/leafs/hanabira/downloads"
			alt="Total Downloads"
	/></a>
	<a href="https://packagist.org/packages/leafs/hanabira"
		><img
			src="https://poser.pugx.org/leafs/hanabira/license"
			alt="License"
	/></a>
</p>
<br />
<br />

Naytive is a fast, lightweight and easy-to-use interface for writing low-level code in TypeScript. It is designed to be a simple and efficient way to replace C/C++ code with more readable and maintainable TypeScript code. This means that you can write low-level code in TypeScript, and then compile it to native code using the Naytive compiler.

![image](https://github.com/user-attachments/assets/388b01c6-a688-4d75-8732-3f671681f744)

This opens up a whole new world of possibilities for TypeScript developers, as they can now write code that can interact with the operating system, hardware, and other low-level components in a way that was previously only possible with C/C++.

## Example

Here is an example of how you can use Naytive to write low-level code in TypeScript:

```typescript
import { std } from '@naytive/core';
import type { int } from '@naytive/types';

export default function main(): int {
  const first_name: string = std.cin('Enter your first name: ');

  std.cout(`Hello, ${first_name}!\n`);
  std.cout('Welcome!');

  return 0;
}
```

## Compromises

Naytive is designed to be a simple and efficient way to write low-level code in TypeScript. However, there are some compromises that you need to be aware of when using Naytive:

- C++ installation required: Naytive compiles TypeScript code to C++ code, which is then compiled to native code using a C++ compiler. This means that you need to have a C++ compiler installed on your system in order to use Naytive.
- Limited standard library: Naytive provides a limited standard library that is designed to be simple and efficient. This means that you may need to write some low-level code yourself in order to interact with the operating system, hardware, and other low-level components.
- Limited libraries: Naytive does not support all TypeScript libraries, as it is designed to be a low-level interface for writing low-level code. This means that you may need to write some low-level code yourself in order to interact with the operating system, hardware, and other low-level components.
- Explicit types: Naytive requires you to explicitly specify types for variables, functions, and other elements in your code. Most TypeScript developers are used having the TypeScript compiler infer types for them, so this may take some getting used to. However, this is necessary in order to generate efficient C++ code.

## Why Naytive?

- **Clean and readable code**: Naytive allows you to write C/C++ equivalent code in TypeScript, which is much cleaner and more readable than C/C++ code.
- **Simple and efficient**: Naytive is designed to be simple and efficient, so you can focus on writing your code instead of worrying about low-level details like memory management and pointer arithmetic.
- **TypeScript**: Naytive is built on top of TypeScript, which is a powerful and expressive language that is widely used in the industry. This means that you can take advantage of TypeScript's features like type checking, interfaces, and generics when writing low-level code with Naytive.

## Getting Started

To get started with Naytive, you can use the `create-naytive-app` CLI tool to create a new project.

```sh
npm create naytive-app@latest
```

## What's in this Repo?

This Turborepo includes the following:

- `docs`: Documentation for Naytive
- `examples`: Example projects that demonstrate how to use Naytive
- `@naytive/compiler`: Compiler for compiling TypeScript code to C++ code
- `@naytive/config`: shared configs used throughout the monorepo
- `@naytive/core`: TypeScript interface for C/C++ libraries
- `@naytive/types`: Native types for TypeScript
- `create-naytive-app`: CLI tool for creating new naytive apps
