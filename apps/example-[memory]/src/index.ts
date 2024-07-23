import { memory, Pointer } from '@naytive/core';
import { int } from '@naytive/types';

export default function main(): int {
  let food: string = 'Pizza';
  const foodPointer: Pointer<string> = memory.unsafe(food);

  food = alert('What\'s your favorite food?\n') as any;

  console.log(`foodPointer: ${foodPointer}\n`);
  console.log(memory.dereference(foodPointer) + '\n');
  console.log(foodPointer.dereference(), 'This is a test');

  return 0;
}
