import { std } from '@naytive/core';
import { int } from '@naytive/types';

export default function main(): int {
  const myNumbers: int[] = [10, 20, 30, 40, 50];

  if (myNumbers.length > 0) {
    for (let i = 0; i < myNumbers.length; i++) {
      std.cout(`${myNumbers[i].toString()}\n`);
    }
  }

  myNumbers.forEach((num: int, index: int, array: int[]) => {
    std.cout(`${num} - ${index}\n`);

    array.forEach((aNumber) => {
      std.cout(`${index} -> ${aNumber}\n`);
    });
  });

  return 0;
}
