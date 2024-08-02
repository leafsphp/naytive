import { delay, OUTPUT, pinMode } from '@naytive/avr';
import type { size_t } from '@naytive/types';

declare const RED_LED = 7;
declare const AMBER_LED = 8;
declare const GREEN_LED = 9;

// unlike in regular TypeScript, we can use the
// import statement anywhere to pull in our own modules
import { blink } from './blink';

export function setup() {
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(AMBER_LED, OUTPUT);
}

export function loop() {
  for (let i: size_t = 0; i < 100; i++) {
    for (let j: size_t = 0; j < i; j++) {
      if (i % 5 == 0) {
        blink(AMBER_LED, 100);
        delay(500);
      } else if (i % 2 == 0) {
        blink(RED_LED, 100);
        delay(500);
      } else {
        blink(GREEN_LED, 100);
        delay(500);
      }
    }

    delay(2000);
  }

  delay(5000);
}
