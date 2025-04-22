BaseClass

class Fruit: 
	# I am a fruit


T = TypeVar("T", bound=Fruit)

class Basket(Generic[T]): 
	# Now T represents Basket is of a certain type





