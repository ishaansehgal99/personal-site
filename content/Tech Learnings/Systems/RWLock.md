
Today I learned what a RWLock. Lets go over what it is. A reader write lock tries to ensure data consistency during read and write operations. The idea is as many readers can be reading the database. But upon write the readers can't be simultaneously reading they must wait until the write completes. 

We run into different scenarios here regarding starvation of readers and writers. If readers have
- Reader-Priority RWLock - Here if readers are reading we wait for them to complete before writer can get access to writing (can lead to writer starvation)
- Writer-Priority RWLock - Here if writers are writing we wait for them to complete before resuming any read operations (can lead to reader starvation)
- Fair RWLock -  Ensures fairness by processing threads in the order they request access. Prevents both reader and writer starvation.


Example implementation of a RWLock

```python
import threading
class RWLock
	def __init__(self):
	    self.readers = 0
		self.writer_sem = threading.Semaphore(1)
		
		self.reader_lock = threading.Lock()
		self.reader_sem = threading.Semaphore(10)

	def acquire_write():
		writer_sem.acquire()
		
	def release_writer():
		writer_sem.release()

	def acquire_reader():
		reader_sem.acquire()
		with reader_lock:
			self.readers += 1
			if self.readers == 1: 
				self.writer_sem.acquire()
	
	def release_reader():
		with reader_lock:
			self.readers -= 1
			if self.readers == 0: 
				self.writer_sem.release()
		reader_sem.release()
```

Solution without enforcing a max amount of readers

```python
import threading
import time

class RWLock:
    def __init__(self):
        self.readers = 0
        self.writer_sem = threading.Semaphore(1)
        # Use a binary semaphore (or lock) to protect the reader count updates
        self.reader_lock = threading.Lock()
    
    def acquire_write(self):
        self.writer_sem.acquire()
        
    def release_write(self):
        self.writer_sem.release()

    def acquire_reader(self):
        self.reader_lock.acquire()
        self.readers += 1
        # First reader blocks writers
        if self.readers == 1: 
            self.writer_sem.acquire()
        self.reader_lock.release()
    
    def release_reader(self):
        self.reader_lock.acquire()
        self.readers -= 1
        # Last reader releases writer lock
        if self.readers == 0: 
            self.writer_sem.release()
        self.reader_lock.release()

# Example usage
def reader(lock: RWLock, reader_id: int):
    lock.acquire_reader()
    print(f"Reader {reader_id} is reading")
    time.sleep(1)
    print(f"Reader {reader_id} finished reading")
    lock.release_reader()

def writer(lock: RWLock, writer_id: int):
    lock.acquire_write()
    print(f"Writer {writer_id} is writing")
    time.sleep(2)
    print(f"Writer {writer_id} finished writing")
    lock.release_write()

if __name__ == "__main__":
    rw_lock = RWLock()
    threads = []
    
    # Start multiple reader threads
    for i in range(3):
        t = threading.Thread(target=reader, args=(rw_lock, i))
        threads.append(t)
    
    # Start a writer thread
    t = threading.Thread(target=writer, args=(rw_lock, 1))
    threads.append(t)
    
    for t in threads:
        t.start()
    for t in threads:
        t.join()

```



FairRWLock

```python
import threading
import time

class FairRWLock:
    def __init__(self):
        # Protects the reader count.
        self.mutex = threading.Lock()
        # Ensures mutual exclusion for writers and the first reader.
        self.writelock = threading.Lock()
        # The turnstile ensures that threads are processed in order.
        self.turnstile = threading.Lock()
        # Current number of active readers.
        self.readers = 0

    def acquire_read(self):
        """
        Readers first pass through the turnstile to ensure fairness.
        Then they increment the reader count in a mutex-protected section.
        The first reader acquires the writelock to block writers.
        """
        # Pass through the turnstile.
        self.turnstile.acquire()
        self.turnstile.release()
        
        # Protect the update to the readers counter.
        with self.mutex:
            self.readers += 1
            if self.readers == 1:
                # The first reader locks out writers.
                self.writelock.acquire()

    def release_read(self):
        """
        When a reader is done, it decrements the reader count.
        The last reader releases the writelock.
        """
        with self.mutex:
            self.readers -= 1
            if self.readers == 0:
                self.writelock.release()

    def acquire_write(self):
        """
        A writer first locks the turnstile, which prevents new readers
        (or writers) from entering. Then it acquires the writelock,
        which waits until any active readers have finished.
        """
        # Lock the turnstile to block new arrivals.
        self.turnstile.acquire()
        # Acquire the writelock to ensure exclusive access.
        self.writelock.acquire()

    def release_write(self):
        """
        Releases the writelock and then the turnstile,
        allowing waiting threads to proceed.
        """
        self.writelock.release()
        self.turnstile.release()


# --- Example Usage ---

def reader(lock: FairRWLock, reader_id: int):
    lock.acquire_read()
    print(f"Reader {reader_id} is reading")
    time.sleep(1)  # Simulate reading time.
    print(f"Reader {reader_id} finished reading")
    lock.release_read()

def writer(lock: FairRWLock, writer_id: int):
    lock.acquire_write()
    print(f"Writer {writer_id} is writing")
    time.sleep(2)  # Simulate writing time.
    print(f"Writer {writer_id} finished writing")
    lock.release_write()

if __name__ == "__main__":
    rw_lock = FairRWLock()
    threads = []

    # Create several reader threads.
    for i in range(5):
        t = threading.Thread(target=reader, args=(rw_lock, i))
        threads.append(t)

    # Create several writer threads.
    for i in range(2):
        t = threading.Thread(target=writer, args=(rw_lock, i))
        threads.append(t)

    # Start all threads.
    for t in threads:
        t.start()

    # Wait for all threads to finish.
    for t in threads:
        t.join()
```


[[Systems]] [[Concurrency]] [[Locking]]

