# C++ Structs

In C++, a `struct` is a user-defined data type that allows you to group related data together. They are similar to TypeScript objects, but with some key differences.

## Declaring a Struct

Here is an example of how you can declare a `struct` in Naytive:

```typescript
import type { int, struct } from 'naytive';

type Car = struct<{
  brand: string;
  model: string;
  year: int;
}>;

const my_car: Car = {
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
};

// or using the C++ style syntax
const my_car2: Car = {};

my_car2.brand = 'Toyota';
my_car2.model = 'Corolla';
my_car2.year = 2020;
```

In this example, we define a `Car` struct with three fields: `brand`, `model`, and `year`. We then create an instance of the `Car` struct and initialize it with some values.

## Accessing Struct Members

You can access the members of a `struct` using the dot (`.`) operator:

```typescript
import { int, struct } from 'naytive';

type Point = struct<{
  x: int;
  y: int;
}>;

const p: Point = { x: 10, y: 20 };

std.cout(p.x); // 10
std.cout(p.y); // 20
```
