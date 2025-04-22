Today I learned about python futures - a future is a promise that in some future time there will be a result. Futures are a bit lower level than coroutines. There are a default placeholder which we manipulate. A future doesn't execute any code on its own, its just like a placeholder for results that require external code to set the outcome.

Whereas a coroutine is a bit higher level, its like a function we can define that we can call keyword await on and resume later. coroutines only run when awaited or scheduled.

asyncio.Future is by default empty and requires us to call `set_result` to populate them. In order to get a result from a asyncio.future we call await on it, and the await is resolved once a `set_result` is hit. Whereas for coroutines we just call the coroutine function with an await on it and this resolves once the function finishes execution. 

So the resolve criteria for an asyncio.future and coroutine are different, one is more loose and generic then the other. 

Now there is also concurrent.futures these allow you to schedule future results across several threads enabling actual parallelism, we can then block as we wait to get results from all threads. 

Example of asyncio.Future (single thread)

```python
import asyncio

async def main(): 
	fut = asyncio.Future()
	async def task(): 
		await asyncio.sleep(10)
		fut.set_result("Finished!")
	asyncio.create_task(task())

	result = await fut
	print(result) # "Finished!"

```


Example of concurrent.futures (multi-threaded)
```python
import time
import concurrent.futures

def task(i): 
	time.sleep(i)
	return i

def main(): 
	with concurrent.futures.ThreadPoolExecutor() as executor:
		futures = [executor.submit(task, i) for i in range(10)]
		for future in concurrent.futures.as_completed(futures): # Blocking call
			time = future.result()
			print(time)
	# Should roughly return 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```



#### **Note `asyncio.to_thread` (Concurrency + Parallelism)**

Using `asyncio.to_thread` allows you to offload work into a new thread using the default threadpool. This lets async code continue executing other tasks concurrently while the blocking operation runs in parallel. 

Example of Concurrency + Parallelism

```python
import asyncio
def parallelize(x): 
	total = 0
	for i in range(x): 
		for j in range(x):
			total += (i + j)
	return total

async def compute(x): 
	return await asyncio.to_thread(parallelize, x)

async def main():
	nums = [1, 10, 100]
	results = await asyncio.gather(*(compute(num) for num in nums))
	print(results)
	return results
```


