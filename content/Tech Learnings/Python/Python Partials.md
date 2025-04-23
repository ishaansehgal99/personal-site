---
publish: true
---

```python
from functools import partial

new_function = partial(original_function, fixed_arg1, fixed_arg2, ...)
```

`partial` function essentially pre-fills certain arguments of a function

```python
from functools import partial

# Regular function
def power(base, exponent):
    return base ** exponent

# Create a new function that always squares a number
square = partial(power, exponent=2)

print(square(5))  # Output: 25
print(square(3))  # Output: 9

```

[[Python]]