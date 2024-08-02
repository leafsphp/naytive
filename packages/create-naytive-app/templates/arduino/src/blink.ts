import { delay, digitalWrite, HIGH, LOW } from "@naytive/avr";
import type { int } from "@naytive/types";

export function blink(led: int, duration: int): void {
  digitalWrite(led, HIGH);
  delay(duration);
  digitalWrite(led, LOW);
}
