Today I learned about python decorators they are basically a way to wrap new functions form old ones to modify or extend their functionality

So for example

```python
def greeting_new(func):
	def wrapper(param): 
		return func(param) + "!!!"
	return wrapper

# Apply the decorator to the function
@greeting_new  # Decorator here
def greeting(name):
	return "Hello, " + name

# At this point, Python has effectively done:
# greeting = greeting_new(greeting)
```

The wrapper in this sense is like saving the original function `greeting`. Then when we call the updated function `greeting`its like we are doing 
```
greeting("Alice") -> 
wrapper("Alice") -> 
original greeting("Alice") + "!!!" -> 
Hello, Alice !!!
```

