We can override priorities in pods to cause pod starvation

They have a two level heap - to prevent certain users from monopolizing the scheduler. 

![[Screenshot 2025-03-01 at 10.05.11 PM.png]]


However what if bob submits all his jobs before Alice? Then again Alice is starved.

So preemption was added - calculate the number of GPUs every active user deserves

![[Screenshot 2025-03-01 at 10.10.17 PM.png]]


Then preempt and reallocate.

https://www.youtube.com/watch?v=34it4-oVZYo&ab_channel=Run%3AaiOfficial%28AcquiredbyNVIDIA%29


[[kubernetes]]
