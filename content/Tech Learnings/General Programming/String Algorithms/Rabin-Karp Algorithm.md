

This is an algorithm for finding matching strings using a "rolling hash" approach.

The idea is that Rabin-Karp's rolling hash is more efficient than a traditional hash which takes `O(k)` time to hash a string.

Using a modulus allows us to keep the number in `int 32-bit`. Using a prime modulus is better for hashing algorithm as it is less divisible with most numbers so makes most sense as a modulus. 


```
hash = (ord(s[0]) x 256^M-1 + ord(s[1]) x 256^M-2 + ...ord(s[M-1])x256^0) % q
```


```python
def substr_search(pattern, text):
	mod = 7841 # Constant used to prevent hash collisions while keeping num low
	m, n = len(pattern), len(text)
	rolling_const = 256**(m-1) % mod

	pattern_hash = 0
	text_hash = 0

	# O(m)
	for j in range(m):
		pattern_hash = (pattern_hash + ord(pattern[j]) * (256**(m-j-1))) % mod
		text_hash = (text_hash + ord(text[j]) * (256**(m-j-1))) % mod

	# O(n-m)
	for i in range(n-m+1):
		if pattern_hash == text_hash:
		    # O(m) if hash collision
			if text[i:i+m] == pattern:
				print("Pattern found at", i)
				return True
		
		# Computing hash of next window
		if i+m < n:
			text_hash -= ord(text[i])*rolling_const
			text_hash %= mod
			text_hash = (text_hash * 256) % mod
			text_hash = (text_hash + ord(text[i+m])) % mod
	
	print("Could not find a substring match")
	return False
```


### Time Complexity

| Case         | Time Complexity |
| ------------ | --------------- |
| Average Case | O(n + m)        |
| Worst Case   | O(n · m)        |
| Space        | O(1)            |

Ideally with minimal hash collision hash matches are minimized. Say incorrect hash collisions occur only a few times or only even once. In that case we have our `O(n + m)` time complexity.


[[Algorithms]]
