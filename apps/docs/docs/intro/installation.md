# Installation

:::warning Note
There is no production release yet. You can try out the proof of concept version by following the instructions below. This page will be updated as newer versions are released.
:::

There are 2 ways to setup Naytive on your system:

- Setting up a new Naytive app using the Naytive CLI
- Downloading the global Naytive binary

Both of these methods require you to have Node.js installed on your system. You can download Node.js from [here](https://nodejs.org/en/download/). Since Naytive compiles to C++, you will also need to have a C++ compiler to build the native binaries.

## Setting up a new Naytive app using the Naytive CLI

This is the recommended way to use Naytive. The Naytive CLI will help you create a new Naytive app with a basic project structure. It will also help you build and run your Naytive app. To get started, you can run the following command:

```bash
npm create naytive-app <my-app>
```

`<my-app>` is the name of your app. This command will create a new directory with the name `<my-app>` and set up a new Naytive app inside it. The Naytive app will have a basic project structure with a `src` directory containing the main Naytive source file `index.ts`. To build and run your Naytive app, you can run the following command:

```bash
npm run build
```

Or you can run in development mode which will continuously watch for changes in your source files and rebuild your app:

```bash
npm run dev
```

## Downloading the global Naytive binary

You can download the global Naytive using npm. To do this, you can run the following command:

```bash
npm install -g @naytive/compiler
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
