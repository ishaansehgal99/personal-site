### Event Loop Internals

Coroutines are scheduled on the event loop as **Tasks**, which are managed in a **task queue**. The event loop continuously picks **ready coroutines** from this queue and executes them.

When a coroutine **hits `await` on an I/O operation**, the event loop:
- Suspends the coroutine 
- Moves it to the waiting queue
- Registers the I/O operation with an I/O multiplexer
	- Linux: epoll. MacOS & BSD: kqueue. Windows: IOCP

This allows the event loop to continue handling **other ready coroutines**.

Once the I/O operation completes, the **OS notifies the event loop** via the I/O multiplexer. The event loop then:
- Moves the **corresponding coroutine** from the **waiting queue back to the ready queue**
- **Resumes execution** of the coroutine from **right after the `await` statement**