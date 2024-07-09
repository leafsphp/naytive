import { int } from '@naytive/types';
import { std } from '@naytive/core';

import { add } from './im';

export default function main(): int {
  const sol: int = add(1, 2);

  std.cout(`The answer is ${sol}!\n`);

  return 0;
}
