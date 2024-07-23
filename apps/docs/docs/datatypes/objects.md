# Naytive Objects "Structs"

Objects are a way to store key-value pairs in Naytive. If you are from a C/C++ background, you may be familiar with structs. Naytive objects are similar to C++ structs, but with a more flexible syntax.

![image](https://github.com/user-attachments/assets/6d5b4e66-8d76-4c17-a501-67b27c0d3efe)

Although these are just regular TypeScript objects, we will refer to them as `structs` to distinguish them from JavaScript objects. Naytive objects are a powerful feature that allows you to create complex data structures and pass them around.

## Declaring an Struct

TypeScript provides a built-in object type that you can use to create objects, so we don't need to import anything from Naytive.

```typescript
import type { int } from 'naytive';

// define a structure for your object
type Car = {
  brand: string;
  model: string;
  year: int;
};

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

Note that Naytive structs are strict: you cannot add or remove properties from an object once it is defined. This is because Naytive objects are designed to be low-level and efficient, and adding or removing properties at runtime can lead to performance issues.

If you need to be able to add or remove properties from an object, you can tell Naytive to allow it by using the `Record` type:

```typescript
import type { int } from 'naytive';

type Point = Record<string, int>;

const p: Point = { x: 10, y: 20 };

p.z = 30; // this is allowed
```

In this example, we define a `Point` struct using the `Record` type, which allows us to add or remove properties from the object at runtime. This can be useful if you need to create objects with dynamic properties, but keep in mind that this is less efficient than using a strict struct.

## Accessing Struct Members

Accessing the members of a struct is similar to accessing the properties of a JavaScript object. You can use the dot (`.`) operator to access the members of a struct:

```typescript
import { int } from 'naytive';

type Car = {
  brand: string;
  model: string;
  year: int;
};

const my_car: Car = {
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
};

console.log(my_car.brand); // Toyota
console.log(my_car.model); // Corolla
console.log(my_car.year); // 2020
```

You can also use the bracket (`[]`) operator to access the members of a struct:

```typescript
import { int } from 'naytive';

type Car = {
  brand: string;
  model: string;
  year: int;
};

const my_car: Car = {
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
};

console.log(my_car['brand']); // Toyota
console.log(my_car['model']); // Corolla
console.log(my_car['year']); // 2020
```

Both methods are equivalent, but using the dot operator is more common and easier to read.

## Nested Structs

You can nest structs inside other structs to create complex data structures. For example, you can define a `Person` struct that contains a `Car` struct:

```typescript
import { int } from 'naytive';

type Car = {
  brand: string;
  model: string;
  year: int;
};

type Person = {
  name: string;
  age: int;
  car: Car;
};

const my_car: Car = {
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
};

const person: Person = {
  name: 'Alice',
  age: 30,
  car: my_car,
};

console.log(person.name); // Alice
console.log(person.age); // 30
console.log(person.car.brand); // Toyota
console.log(person.car.model); // Corolla
console.log(person.car.year); // 2020
```

In this example, we define a `Car` struct and a `Person` struct that contains a `Car` struct. We then create an instance of the `Car` struct and pass it to the `Person` struct.
