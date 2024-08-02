import { memory, Pointer, std } from '@naytive/core';
import type { int } from '@naytive/types';

export default function main(): int {
  let food: string = 'Pizza';
  const foodPointer: Pointer<string> = memory.unsafe(food);

  food = std.cin('What\'s your favorite food?\n');

  console.log(`foodPointer: ${foodPointer}\n`);
  console.log(memory.dereference(foodPointer) + '\n');
  console.log(foodPointer.dereference(), 'This is a test');

  return 0;
}
