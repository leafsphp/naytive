import { std } from "@naytive/core";
import { int } from "@naytive/types";

export default function main(): int {
  const myNumbers: Array<int> = [10, 20, 30, 40, 50];

  if (myNumbers.length > 0) {
    for (let i = 0; i < myNumbers.length; i++) {
      std.cout(`${myNumbers[i].toString()}\n`);
    }
  }

  // myNumbers.forEach((num, index, array) => {
  //   std.cout(`${num} - ${index}\n`);

  //   array.forEach((num) => {
  //     std.cout(`${num}\n`);
  //   });
  // });

  return 0;
}
