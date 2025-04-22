
### Preface 

This conversation sparked from how python and/or other languages perform method resolution order. How do they figure out the subclasses and class tree in order to figure out which functions to call? Do they build a table? 

If so could is that table made at compile time and then kept static? Or could it change during runtime and so must be dynamically computed? Vtable? Whats that? Is there differences in how this is done between compiled vs interpreted languages?

### Observation
This is an example of something someone showed me in python recently and for some reason it blew my mind.

```python
class A:
	def get(self):
		return 1

class B:
	def get(self):
		return 2

class C(A, B): 
	def get(self):
	    return 3


c_class = C()
print(c_class.get()) # Prints 3

print (isinstance(c_class , B)) # Prints True

c_class.__class__ = A

print(c_class.get()) # Prints 1
```





I could not understand how you could change the actual class reference dynamically of an object. If we try to change a class itself we get 

```
TypeError: __class__ assignment only supported for heap types or ModuleType subclasses
```

Instead we must do `instance.__class__ = NewClass`