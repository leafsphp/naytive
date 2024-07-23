# Naytive For TypeScript Devs

![image](https://github.com/user-attachments/assets/7f970c90-1465-436c-a1e2-929ad4dacc76)

TypeScript is a great language for writing high-level code, but is not well-suited for writing low-level code. It is not designed to interact with the operating system, hardware, and other low-level components. This is where Naytive comes in. Naytive is a bridge that allows you to write TypeScript which is then converted into C/C++ so it can be compiled into machine code. This gives you the best of both worlds: the high-level features of TypeScript and the low-level capabilities of C/C++.

## What's possible?

Naytive is still in the early stages of development, so it is not yet a 1:1 replacement for C/C++. However, the goal is to make Naytive capable of everything that C/C++ can do, and more. Here are some of the things that Naytive will be able to do:

- **Interact with the operating system**: Naytive will allow you to interact with the operating system and do things like reading/writing files, interacting with networks, and so much more.

- **Interact with hardware**: Naytive will allow you to interact with hardware in a way that is similar to C/C++. This means that you can write code that communicates with sensors, motors, and other hardware components.

- **Write low-level code**: Naytive will allow you to write low-level code in TypeScript that is then converted into C/C++. This means that you can write code that interacts with memory, registers, and other low-level components.

## What's different?

Since Naytive code is basically TypeScript code, you would expect every TypeScript feature to work in Naytive. However, that is not the case. Naytive is designed to be a simple interpretation of C/C++ in TypeScript, so there are some TypeScript features that cannot be carried over. Here are the key differences:

- `any` and `unknown` types: Naytive partially supports these types as they can't always be converted into C/C++. They may work in some cases, but it is recommended to define the type of a variable whenever possible.

- Built-in compound types: Naytive does not support using TypeScript's `|` and `&` operators to create compound types. Instead, Naytive provides its own compound types that are designed to be simple and efficient. eg:

```typescript
type MY_TYPE = int | string; // This is not supported in Naytive
```

Instead, use Naytive's compound types:

```typescript
import { compound } from '@naytive/core';

...

type MY_NAYTIVE_TYPE = compound<int | string>;
```

- Type inference: Naytive has limited support for type inference. TypeScript has powerful type inference capabilities, but Naytive does not have the same level of sophistication. This means that you will need to specify types more often in Naytive than you would in TypeScript.

- Decorators: Naytive does not support TypeScript decorators. Decorators are a powerful feature of TypeScript that allows you to add metadata to classes, methods, and properties. Naytive does not support this feature, so you will need to find alternative ways to achieve the same functionality.

- Mixins: Naytive does not support TypeScript mixins. Mixins are a way to add methods and properties to a class without using inheritance. Naytive does not support this feature, so you will need to find alternative ways to achieve the same functionality.

Besides these differences, Naytive is designed to be as close to TypeScript as possible. This means that if you're familiar with TypeScript, you should be able to pick up Naytive pretty quickly. Naytive is designed to be simple and easy to use, so you should feel right at home if you're a TypeScript developer.

**Note that your IDE may not notify you of these differences, so it is recommended to refer to the Naytive documentation for more information.**

## Additions to TypeScript

Just as we have limitations on some TypeScript features, Naytive also adds some features to TypeScript to make it more powerful. Here are some of the key additions:

- Special types: Naytive adds special types to TypeScript that are designed to make it easier to write low-level code. These types include `int`, `float`, `short`, `ushort`, `long`, `ulong`, `float`, `double`, and more. You can find a full list of Naytive types in the [types documentation](/docs/datatypes/).

- Naytive standard library: Naytive adds a standard library to TypeScript that provides interfaces to interact with the C/C++ functions. Note that Naytive's standard library is different from C/C++'s standard library, so you can't use C/C++'s standard library functions directly in Naytive.

- Naytive modules: TypeScript allows you to import modules using the `import` keyword. Naytive extends this functionality by allowing you to import C/C++ modules and libraries using the `import` keyword. This means that you can use C/C++ functions in your TypeScript code without having to write any C/C++ code.

Note that these features are all designed in a way that is consistent with TypeScript's design philosophy. They don't introduce any new concepts or paradigms, so you should be able to pick them up pretty quickly if you're familiar with TypeScript.
