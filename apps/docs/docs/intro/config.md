# Config

Since Naytive was built for use in multiple environments, it is highly configurable. Naytive allows you to configure what kinds of builds are generated, the kinds of runners that are used, and the settings for each of those runners. This page will walk you through the configuration options available in Naytive.

## Configuration File

Naytive uses a configuration file to determine how to build your project. It can be written in either JSON or JavaScript/TypeScript. The configuration file should be named `naytive.config.js` or `naytive.config.json` and should be placed in the root of your project. This is standard for most build tools, so you should be familiar with this pattern if you have used other build tools in the past.

- noRun: boolean
  - If true, no runners will be run. This is useful for debugging your configuration file.
  - Default: false
- debug: boolean
  - If true, debug information will be printed to the console.
  - Default: false
- output: string
  - The directory where the build output will be placed.
  - Default: "dist/"
- entry: string
  - The entry file for your project.
  - Default: "index.ts"
- compileType: string
  - The type of build to generate. This can be either ".c", ".cpp" or ".ino".
  - Default: ".cpp"
- noNativeBuild: boolean
  - If true, no native build will be generated.
  - Default: false
- keepCppSource: boolean
  - If true, the C++ source files will be kept after the build.
  - Default: false

Eg: `naytive.config.js`

```json
{
  "entry": "src/index.ts",
  "output": "dist",
  "debug": true,
  "noNativeBuild": true,
  "keepCppSource": true,
  "compileType": ".cpp",
}
```

Example Arduino configuration:

```javascript
module.exports = {
  entry: 'src/index.ts',
  output: 'dist',
  noNativeBuild: true,
  keepCppSource: true,
  compileType: '.ino', // This tells the compiler to compile the code as an Arduino sketch
  config: {
    board: 'arduino:avr:uno',
    port: '/dev/cu.usbmodem1301',
  },
};
```
