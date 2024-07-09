import { int } from '@naytive/types';
import { std } from '@naytive/core';

// C++ files [ignore squigglies]
import { add } from './add.h';
import { sub } from './sub.h';

export default function main(): int {
  const soln: int = add(1, 2);
  const soln2: int = sub(3, 2);

  std.cout(`Hello, ${soln} and ${soln2}!\n`);

  return 0;
}
