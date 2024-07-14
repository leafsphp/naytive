import { int, size_t } from '@naytive/types';
import { delay, digitalWrite, HIGH, LOW, OUTPUT, pinMode } from '@naytive/avr';

declare const RED_LED = 7;
declare const AMBER_LED = 8;
declare const GREEN_LED = 9;

function blink(led: int, duration: int): void {
  digitalWrite(led, HIGH);
  delay(duration);
  digitalWrite(led, LOW);
}

function turn_off_all_leds(): void {
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(AMBER_LED, LOW);
}

export function setup(): void {
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(AMBER_LED, OUTPUT);
}

export function loop(): void {
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
