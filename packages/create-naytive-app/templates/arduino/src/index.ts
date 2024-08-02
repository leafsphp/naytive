import { delay, OUTPUT, pinMode, LED_BUILTIN } from '@naytive/avr';
import { blink } from './blink';

export function setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

export function loop() {
  blink(LED_BUILTIN, 1000);
  delay(500);
}
