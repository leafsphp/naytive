# Enums

From the TypeScript documentation:

> Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.
> Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases. TypeScript provides both numeric and string-based enums.

## Numeric Enums

Numeric enums are enums where each member has a numeric value. These values can be either positive or negative integers. Enums can be defined using the `enum` keyword:

```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

console.log(Direction.Up); // Output: 1
console.log(Direction.Down); // Output: 2
console.log(Direction.Left); // Output: 3
console.log(Direction.Right); // Output: 4
```

Above, we have a numeric enum where Up is initialized with 1. All of the following members are auto-incremented from that point on. In other words, Direction.Up has the value 1, Down has 2, Left has 3, and Right has 4.

If we wanted, we could leave off the initializers entirely:

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction.Up); // Output: 0
console.log(Direction.Down); // Output: 1
console.log(Direction.Left); // Output: 2
console.log(Direction.Right); // Output: 3
```

This auto-incrementing behavior is useful for cases where we might not care about the member values themselves, but do care that each value is distinct from other values in the same enum.

## String Enums

In a string enum, each member has to be constant-initialized with a string literal, or with another string enum member:

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

console.log(Direction.Up); // Output: 'UP'
console.log(Direction.Down); // Output: 'DOWN'
console.log(Direction.Left); // Output: 'LEFT'
console.log(Direction.Right); // Output: 'RIGHT'
```

String enums are useful when the member values are more important than their auto-incrementing behavior. For example, string enums are useful when the member values are descriptive strings.

## Heterogeneous Enums

TypeScript allows enums to have a mix of string and numeric members, however, Naytive does not support this feature:

```typescript
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES',
}

// Error: Naytive does not support heterogeneous enums
```
