---
publish: true
---

A counting array is simply an array to keep track of how often each number occurs in an array. 

The index represents the value we want the frequency of. 
```python
arr = [4, 2, 2, 8, 3, 3, 1]
count = [0] * (max(arr) + 1)

for num in arr:
    count[num] += 1

print(count)  # Output: [0, 1, 2, 2, 1, 0, 0, 0, 1]
```

However note counting arrays can become ver memory inefficient when we have large values in our array. As the size of the counting array depends on the maximum value in the input, not the length of the input array. 


```python
count = [0] * (max(arr) + 1)  # count has 101 elements

for num in arr:
    count[num] += 1

print(count[3])    # 2
print(count[50])   # 1
print(count[100])  # 1
```


If the **max value is huge** (e.g. 1 million), and your array only has a few elements — a counting array becomes **very memory-inefficient**.

In that case, use `collections.Counter` instead:

```python
from collections import Counter

arr = [4, 2, 2, 8, 3, 3, 1]
c = Counter(arr)
print(c)  # Output: Counter({2: 2, 3: 2, 4: 1, 8: 1, 1: 1})
```
