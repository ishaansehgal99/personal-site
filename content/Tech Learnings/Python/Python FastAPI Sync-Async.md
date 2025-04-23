---
publish: true
---
## `FastAPI` Key differences between`async def` with `await`, `async def` without `await`, and `def`:

| Feature                                     | **`async def` without `await`**                                                         | **`async def` with `await`**                                                           | **`def` (Synchronous Function)**                                                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Concurrency**                             | Sequential                                                                              | Concurrent (Non-blocking, async I/O operations)                                        | Parallel (Multiple threads)                                                                                                                         |
| **Event Loop Blocking**                     | Blocks the event loop because no `await` is used                                        | Non-blocking, allows the event loop to process other requests                          | Blocks the current thread, but FastAPI uses a thread pool to handle other requests                                                                  |
| **Use Case**                                | Not ideal for CPU or I/O-bound tasks                                                    | Ideal for I/O-bound tasks (e.g., network, database)                                    | Ideal for CPU-bound tasks or non-blocking operations                                                                                                |
| **Handling of Multiple Requests**           | Sequential, only one request can be processed at a time                                 | Handles multiple requests concurrently, making use of async I/O                        | Handles multiple requests in parallel using threads                                                                                                 |
| **Threading**                               | Single-threaded, Sequential                                                             | Single-threaded (event loop manages concurrency)                                       | Multi-threaded (each request can be handled as separate thread)                                                                                     |
| **Performance for CPU and I/O-bound tasks** | N/A for CPU bound tasks, no CPU parallleism leveraged<br>Inefficient of I/O bound tasks | N/A for CPU bound tasks, no CPU parallelism leveraged<br>Efficient for I/O Bound tasks | Ideal for CPU-Bound tasks, as it exploits concurency*<br><br>Not ideal for I/O-Bound tasks, as threads are blocked while waiting for I/O Operations |

*However due to GIL python threads are not actually running in parallel. Threads do not run across core and are context switched between.


Each Uvicorn worker is a separate process with its own event loop. 

#### `async def - Async (Sequential)`

```Python
async def get_burgers(number: int):
    # Do some asynchronous stuff to create the burgers
    return burgers
```


#### `async def - Async/Await (Concurrent)`

With Async-Await Pattern, when a worker hits an await it tells the worker that it can do something else in the meantime. Freeing the event loop for the next task

```python
# Assume `get_burgers` is an async function
async def get_burgers(quantity):
    # Simulating an async I/O task, such as querying a database or calling an API
    await asyncio.sleep(1)
    return [{"name": "Cheeseburger"}, {"name": "Veggie Burger"}]

@app.get('/burgers')
async def read_burgers():
    burgers = await get_burgers(2)  # This works because get_burgers is async
    return burgers
```


The awaited function must also be async def defined for the await keyword to work. 

#### `def (Parallel)`

FastAPI functions defined with `def` take each request and run them in an external ThreadPool, that is then awaited. This frees the server.

#### `Coroutines`
- **Coroutine Function** is any function defined with async def (this function will always return a coroutine object)
- **Coroutines Object** is an object returned by calling an `async def` function, and they are **awaitable**, awaiting a coroutine object allows you to get its final result
- Await allow **asynchronous execution** by yielding control back to the event loop during waiting periods (like I/O operations).

### Async Internal Calls

While the above examples dealt with Async calls in reference to HTTP Requests (in async-await each new request triggers a new coroutine that can run concurrently). Lets now briefly take a look at how Async calls work inside a function. 

#### Using `await` in a loop (Semi-Concurrent, but Sequential Kickoff)

Take a look at this function 
```python
import asyncio

async def fetch_document(doc_id):
    await asyncio.sleep(1)  
    return f"Document {doc_id}"

async def retrieve_documents(doc_ids):
    results = []
    for doc_id in doc_ids:
        result = await fetch_document(doc_id)  # Each task starts only after the previous one finishes
        results.append(result)
    return results

doc_ids = [1, 2, 3, 4, 5]
results = asyncio.run(retrieve_documents(doc_ids))
print(results)
```
⏳ **Total Time: ~5 seconds**
✅ Tasks **still yield control** when waiting, so the event loop remains unblocked.
❌ However, **next task starts only after the previous one completes**, leading to wasted time.

Here we can see that even though we use the async-await pattern the code still takes full 5 seconds!

So now lets try with using asyncio.gather
#### **Using `asyncio.gather` (Fully Concurrent)**

```python
async def retrieve_documents(doc_ids):
    tasks = [fetch_document(doc_id) for doc_id in doc_ids]  
    return await asyncio.gather(*tasks)

results = asyncio.run(retrieve_documents(doc_ids))
print(results)
```

⏳ **Total Time: ~1 second**  
✅ All tasks **kick off simultaneously**  
✅ Event loop remains unblocked, making full use of concurrency

Awesome! So when to use one or the other?

### **Key Difference: Why `asyncio.gather` is Needed for Internal Calls but Not for HTTP Requests**

| Scenario                                           | Needs `asyncio.gather`? | Why?                                                                                     |
| -------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| **Multiple incoming HTTP requests**                | ❌ No                    | Each request runs independently in the event loop and executes concurrently.             |
| **Loop inside a function**                         | ✅ Yes                   | Each `await` waits for the previous one before starting the next.                        |
| **Fetching multiple documents inside one request** | ✅ Yes                   | Without `asyncio.gather`, document retrievals will run sequentially inside that request. |

[[Python]]