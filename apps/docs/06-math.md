# Math

C++ has many functions that allows you to perform mathematical tasks on numbers. All of these functions are available in Naytive as well. Here are some of the most commonly used math functions:

## Max and min

The `max` and `min` functions return the maximum and minimum of two numbers, respectively:

```typescript
import { math, std } from 'naytive';

...

std.cout(math.max(10, 20));
std.cout(math.min(10, 20));
```

## C++ Math Functions

Naytive provides a number of math functions that are similar to the ones available in C++. Here are some examples:

```typescript
import { math, std } from 'naytive';

...

std.cout(math.abs(-10)); // 10
std.cout(math.sqrt(25)); // 5
std.cout(math.pow(2, 3)); // 8
std.cout(math.floor(3.14)); // 3
std.cout(math.ceil(3.14)); // 4
std.cout(math.round(3.14)); // 3
std.cout(math.sin(math.PI / 2)); // 1
std.cout(math.cos(math.PI)); // -1
std.cout(math.tan(math.PI / 4)); // 1
std.cout(math.asin(1)); // 1.5708
std.cout(math.acos(-1)); // 3.1416
std.cout(math.atan(1)); // 0.7854
std.cout(math.atan2(1, 1)); // 0.7854
std.cout(math.log(10)); // 2.3026
std.cout(math.log10(100)); // 2
std.cout(math.exp(1)); // 2.7183
std.cout(math.hypot(3, 4)); // 5
std.cout(math.degrees(math.PI)); // 180
std.cout(math.radians(180)); // 3.1416
...
```

You can find more information about these functions in the [C++ reference](https://en.cppreference.com/w/cpp/numeric/math).
