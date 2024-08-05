# Installation

:::warning Note
There is no production release yet. You can try out the proof of concept version by following the instructions below. This page will be updated as newer versions are released.
:::

There are 2 ways to setup Naytive on your system:

- Setting up a new Naytive app using the Naytive CLI
- Downloading the global Naytive binary

Both of these methods require you to have Node.js installed on your system. You can download Node.js from [here](https://nodejs.org/en/download/). Since Naytive compiles to C++, you will also need to have a C++ compiler to build the native binaries.

## Setting up a new Naytive app using create-naytive-app

This is the recommended way to use Naytive as it sets up a new Naytive app with a basic project structure. You can do this using your favourite package manager:

```bash
pnpm create naytive-app
```

Or you can use `npx`/`pnpx`:

```bash
npx create-naytive-app
```

This command will prompt you to enter the name of your Naytive app and select a template. You can choose from the following templates:

```bash
? Select a template: › - Use arrow-keys. Return to submit.
❯   Basic C++
    Basic Arduino
```

These are different templates that set up a new Naytive app with a different target environment. The `Basic C++` template sets up a new Naytive app with a basic project structure that compiles to a native binary executable. The `Basic Arduino` template sets up a new Naytive app with a basic project structure that compiles to an Arduino sketch. We plan to add more templates in the future, targeting different environments like WebAssembly, Raspberry Pi, etc.

The generated Naytive app will have a basic project structure with a `src` directory containing the main Naytive source file `index.ts`. To build and run your Naytive app, you can run the following command:

```bash
pnpm run build
```

Or you can run in development mode which will continuously watch for changes in your source files and rebuild your app:

```bash
pnpm run dev
```

## Downloading the global Naytive binary

You can download the global Naytive using your favourite package manager. To do this, you can run the following command:

```bash
pnpm install -g @naytive/compiler
```

This will install the global Naytive binary on your system. You can now use the Naytive binary to build and run your Naytive apps. To build your Naytive app, you can run the following command:

```bash
naytive build ./path/to/your/app.ts
```

Or you can pass in a naytive config file:

```bash
naytive build ./path/to/naytive.config.json
```

## How does Naytive work?

Naytive in the simplest terms is a TypeScript to C++ transpiler. It takes TypeScript code and converts it into C++ code. This C++ code is then compiled using a C++ compiler to produce a binary executable which can be run on any platform. Naytive also provides a runtime library that is linked with the compiled binary to provide the necessary low-level functionality that TypeScript does not have.

```md
TypeScript -> Naytive Compiler -> C++
```

Depending on the expected environment, Naytive can call different runners to execute the generated C++ code. For example, Naytive can call the Arduino runner to execute the generated C++ code on an Arduino board if the target environment is an Arduino board.

```md
C++ -> Naytive Runner -> Target Environment
```

For now, only native binary executables and Arduino boards are supported as target environments. More target environments will be supported in the future.
