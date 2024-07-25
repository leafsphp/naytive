# Arduino

Arduino is an open-source electronics platform based on easy-to-use hardware and software. Arduino boards are able to read inputs - light on a sensor, a finger on a button, or a Twitter message - and turn it into an output - activating a motor, turning on an LED, publishing something online. You can tell your board what to do by sending a set of instructions to the micro-controller on the board. To do this, you use the Arduino programming language (based on Wiring) and the Arduino Software (IDE), based on Processing.

Naytive allows you to program Arduino boards using TypeScript. This is done by using the `@naytive/avr` package, which is a TypeScript interface to the Arduino AVR libraries. This package allows you to write TypeScript code that is compiled to C++ and uploaded to the Arduino board.

## Getting started

To get started with Arduino, you need to have an Arduino board. The most common board is the Arduino Uno, which is a great board for beginners. You can find more information about the Arduino Uno [here](https://store.arduino.cc/arduino-uno-rev3). You need to download the Arduino IDE from the [official website](https://www.arduino.cc/en/software) and the Arduino CLI from the [official website](https://arduino.github.io/arduino-cli/installation/). You wont need to use the Arduino IDE, but you will need to use the Arduino CLI to compile and upload your code to the board.

Finally, you can set up your Naytive project by running the following command:

```bash
npm create naytive-app my-arduino-app --template arduino
```

This will generate a new Naytive project with the Arduino template. You can then navigate to the project directory and install the dependencies:

```bash
cd my-arduino-app
pnpm install
```

## How to run

The next thing to do is to identify your board and it's port. To do this, connect your Arduino board to your computer and run the following command:

```bash
arduino-cli board list
```

You should get an output similar to this:

```bash
$ arduino-cli board list

Port                            Protocol Type              Board Name  FQBN            Core
/dev/cu.Bluetooth-Incoming-Port serial   Serial Port       Unknown
/dev/cu.usbmodem1301            serial   Serial Port (USB) Arduino Uno arduino:avr:uno arduino:avr
```

*If your board is Unknown, or you have not completed the setup for your board, check out the [Arduino CLI docs](https://arduino.github.io/arduino-cli/1.0/getting-started/)*

The next step is to update your Naytive configuration file to include the port:

```json
...
"config": {
  "board": "arduino:avr:uno",
  "port": "/dev/cu.usbmodem1301",
}
```

From there, simply run the dev script:

```bash
pnpm run dev
```

This will compile your TypeScript code to C++ and upload it to your Arduino board. You should see the built-in LED on the Arduino board blink on and off.

## Example application

The example application in the Arduino template is a simple program that blinks the built-in LED on the Arduino board. You can find the code in the `src/main.ts` file. The code is as follows:

```typescript
import { delay, digitalWrite, pinMode, HIGH, LOW, LED_BUILTIN, OUTPUT } from '@naytive/avr';

export function setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

export function loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
```

At a glance, this looks exactly like the code you would write in C++ for an Arduino board. The only difference is that you are writing it in TypeScript. This code sets up the built-in LED on the Arduino board as an output, and then blinks the LED on and off every second. You can modify this code to do whatever you want with your Arduino board.

`@naytive/avr` tries to provide a 1:1 mapping of the Arduino C++ API to TypeScript. The only difference would be the hard C++ code that you would write in C++ is now written in TypeScript.

## AVR Library API

The `@naytive/avr` package provides a TypeScript interface to the Arduino AVR libraries. This package is a work in progress, and not all of the Arduino AVR libraries are implemented yet, however, the most common ones are. This section details the API that is available in the `@naytive/avr` package.

### Core functions

- `delay(ms: number): void` - Pauses the program for the specified number of milliseconds.
- `micros(): number` - Returns the number of microseconds since the program started.
- `millis(): number` - Returns the number of milliseconds since the program started.

### Digital I/O functions

- `digitalRead(pin: number): number` - Reads the value from a specified digital pin.
- `digitalWrite(pin: number, value: number): void` - Writes a value to a specified digital pin.
- `pinMode(pin: number, mode: number): void` - Configures the specified pin to behave either as an input or an output.

### Analog I/O functions

- `analogRead(pin: number): number` - Reads the value from the specified analog pin.
- `analogWrite(pin: number, value: number): void` - Writes an analog value to a pin.

### Advanced I/O functions

- `noTone(pin: number): void` - Stops the generation of a square wave triggered by `tone()`.
- `pulseIn(pin: number, value: number, timeout: number): number` - Reads a pulse (either HIGH or LOW) on a pin.
- `pulseInLong(pin: number, value: number, timeout: number): number` - Reads a pulse (either HIGH or LOW) on a pin.

### Time functions

- `delayMicroseconds(us: number): void` - Pauses the program for the specified number of microseconds.

### Math functions

- `min(a: number, b: number): number` - Returns the smaller of two numbers.
- `max(a: number, b: number): number` - Returns the larger of two numbers.
- `abs(x: number): number` - Returns the absolute value of a number.

### Trigonometry functions

- `cos(rad: number): number` - Returns the cosine of an angle.
- `sin(rad: number): number` - Returns the sine of an angle.
- `tan(rad: number): number` - Returns the tangent of an angle.
