# Compound Types

Compound types are types that are composed of multiple other types. This simply allows you to combine multiple types into a single type. TypeScript allows you to create compound types using the `&` or `|` operators. Naytive does not support using these operator directly, but you can use the `intersection` and `union` types to create compound types.

## Intersection Types

Intersection types are created using the `&` operator. An intersection type is a type that contains all the properties of the types it is composed of. This means that an object of an intersection type must satisfy all the types it is composed of.

Here is an example of an intersection type:

```typescript
import type { intersection } from '@naytive/types';

type A = {
  a: number;
};

type B = {
  b: string;
};

type C = intersection<A & B>;
```

In this example, the `C` type is an intersection type that contains all the properties of the `A` and `B` types. This means that an object of type `C` must have both a `number` property `a` and a `string` property `b`.

You can also use intersection types with interfaces:

```typescript
import type { intersection } from '@naytive/types';

interface A {
  a: number;
}

interface B {
  b: string;
}

type C = intersection<A & B>;
```

## Union Types

Union types are created using the `|` operator. A union type is a type that can be one of the types it is composed of. This means that an object of a union type can satisfy any of the types it is composed of.

Here is an example of a union type:

```typescript
import type { union } from '@naytive/types';

type A = {
  a: number;
};

type B = {
  b: string;
};

type C = union<A | B>;

const c1: C = { a: 1 }; // OK
const c2: C = { b: 'hello' }; // OK
const c3: C = { a: 1, b: 'hello' }; // Error
```

These don't have to be structs, they can be any type:

```typescript
import type { union } from '@naytive/types';

type C = union<number | string>;

const c1: C = 1; // OK
const c2: C = 'hello'; // OK
const c3: C = true; // Error
```
