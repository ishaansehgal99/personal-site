---
publish: true
---

![[dining_philosophers_final.png]]

Five philosophers five forks. The core problem here arises when all five philosophers are trying to acquire a fork someone else has already acquired. If this conditions holds for all philosophers then we have a deadlock, so how do we fix this.

Semaphore approach - Use semaphores to ensure only four out of the five (n-1) philosophers at most are holding forks at once. This breaks that chain of the fifth requiring a fork.

Resource Hierarchy - A neat one. This solution is that every philosopher tries to acquire the smaller indexed of the two forks. So while philosophers 0-3 try to acquire their left fork. The fifth philosopher will first go for their right then their left. This is beneficial as it breaks the chain of every philosopher relying on a fork someone else has already acquired. (Generally seen as the most efficient)


https://leetcode.com/problems/the-dining-philosophers/description/


[[Systems]] [[Concurrency]]