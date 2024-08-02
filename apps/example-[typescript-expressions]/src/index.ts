import { std } from '@naytive/core';
import { int } from '@naytive/types';

export default function main(): int {
  const first_name: string = 'John';
  const first_name2: string = first_name?.toUpperCase();

  std.cout(`${first_name}, type: ${typeof first_name}\n`);
  std.cout(`${first_name2}, type: ${typeof first_name2}\n`);
  std.cout(`${first_name.length}\n`);
  std.cout(`${first_name.toUpperCase()}\n`);
  std.cout(`${first_name.toLowerCase()}\n`);
  std.cout(`${first_name[0]}\n`);
  std.cout(`${first_name.replace('John', 'Doe')}\n`);

  return 0;
}
