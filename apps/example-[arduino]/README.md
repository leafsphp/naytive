# Arduino Example

This example is shows how to program an Arduino board using the `@naytive/avr` package. This example is a simple blink program that blinks an LED connected to pin 13 on the Arduino board.

## How to run

To get started you need to have the Arduino CLI installed. This is an official tool from Arduino that allows you to compile and upload code to your Arduino board. You can find the installation instructions [here](https://arduino.github.io/arduino-cli/installation/).

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

From there, simply install the dependencies and run the dev script:

```bash
pnpm install
pnpm run dev
```
