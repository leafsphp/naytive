# Pointers and Memory

Naytive doesn't have a traditional garbage collector, however, it still manages memory for you and tries to be as efficient as possible.

Naytive tries to keep all your data in stack memory without having you to worry about it. This means that Naytive will automatically set the needed memory for your variables even if you don't specify it eg. `const a = 5` will automatically set the memory for `a` to be 16-bits because it is an unsigned short integer.
