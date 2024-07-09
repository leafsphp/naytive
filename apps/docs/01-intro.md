# Introduction

***NAYTIVE IS IN THE VERY EARLY STAGES OF DEVELOPMENT. IT IS CURRENTLY ONLY CAPABLE OF VERY LIMITED STUFF, BUT THE DOCUMENTATION COVERS SOME FUTURE EXPECTED FEATURES***

Naytive is a fast, lightweight and easy-to-use interface for writing low-level code in TypeScript. It is designed to be a simple and efficient way to replace C/C++ code with more readable and maintainable TypeScript code. This means that you can write all of your intense code in TypeScript, and still reap all the benefits of a low-level language with as few complexities as possible.

This opens up a whole new world of possibilities for TypeScript developers, as they can now write code that can interact with the operating system, hardware, and other low-level components in a way that was previously only possible with C/C++.

## Example

This is a simple example that requests the user's first name and then greets them:

```typescript
import { std } from '@naytive/core';
import type { int } from '@naytive/types';

const first_name: string = std.cin('Enter your first name: ');

std.cout(`Hello, ${first_name}!\n`);
std.cout('Welcome!');
```

## Building Naytive

If you set up Naytive using the Naytive CLI, you can build your Naytive code using the following command:

```bash
npm run build
```

If you downloaded the compiler code, you can build Naytive using the following command:

```bash
/path/to/naytive-compiler/naytive ./path/to/your/file.ts
```

Or a path to your configuration file:

```bash
/path/to/naytive-compiler/naytive ./path/to/your/config.json
```
