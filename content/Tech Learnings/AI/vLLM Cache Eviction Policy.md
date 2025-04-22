
vLLM has a three tiered cache eviction policy

1. Reference Count First
   A reference count is maintained for each KV block. KV blocks with a reference count of zero (meaning no active usage) are eligible for eviction. This prevents evicting in-use data.
2. LRU Among Unused
   Within the set of KV blocks that have a reference count of zero, we employ a LRU policy to prioritize eviction.
3. Longest Prefix Tie-Breaker
   If multiple KV blocks have the same last access time (a rare but possible case in LRU), then it evicts the one at the end of the longest prefix - likely a strategy to preserve blocks that contribute to shared or reused prompts, optimizing reuse and reducing compute. 

Example of Longest Prefix Tie-Breaker:

Imagine you have these prompts:
- **A:** "You are a helpful assistant. Explain photosynthesis. And the meaning of life. And the meaning of watermelon."
- **B:** "You are a helpful assistant. Translate to French."

They share a prefix: `"You are a helpful assistant."`

When the cache is full, and it has to evict something:
- It prefers **not** to evict "You are a helpful assistant." (shared and likely reused).
- The “longest prefix” tie-breaker is used to evict the **deeper block**.
- In our example, if both tails are equally unused and equally old, **“Explain photosynthesis…”** (the longer tail) is evicted first.

 [[AI]] [[Inference]] [[caching]]