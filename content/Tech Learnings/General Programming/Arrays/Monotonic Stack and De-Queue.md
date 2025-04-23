---
publish: true
---

### Monotonic Stack

A stack that keeps elements in sorted order (increasing or decreasing). Stack that only lets you push elements if it preserves monotonicity


```python
nums = [2, 1, 5, 3]
stack = []

for num in nums:
    while stack and stack[-1] > num:
        stack.pop()
    stack.append(num)

print(stack)  # [1, 3]
```


### Monotonic Deque/Queue

The deque maintains a **decreasing** sequence (front is biggest), so `dq[0]` is always the max. 

Both Queue and Deque refer to the same logic. It's just wording preference — "deque" highlights the data structure used; "queue" emphasizes the algorithmic role.

```python
from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()
    res = []

    for i, num in enumerate(nums):
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)

        if dq[0] == i - k:
            dq.popleft()

        if i >= k - 1:
            res.append(nums[dq[0]])
    
    return res
```