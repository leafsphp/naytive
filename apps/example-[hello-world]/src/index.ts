import { std } from '@naytive/core';
import { int } from '@naytive/types';

export default function main(): int {
  const first_name: string = std.cin('Enter your first name: ');

  std.cout(`Hello, ${first_name}!\n`);
  std.cout('Welcome!');

  return 0;
}
