import { std } from '@naytive/core';
import { int } from '@naytive/types';

const first_name: string = std.cin('Enter your first name: ');

export default function main(): int {
  std.cout(`Hello, ${first_name}!\n`);

  console.log('You can also use console.log to print to the console.\n');
  console.log('Concate', 'nate ', 'strings ', 'with ', 'console.log\n');

  return 0;
}
