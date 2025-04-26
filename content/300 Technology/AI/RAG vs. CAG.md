---
publish: true
---
Over the past year, there have been many new experiments with the existing RAG architecture, including CRAG and Self-RAG, to name a few. Now, here we take a look at one such uniquely powerful architecture that’s gaining interest: **Cache-Augmented Generation (CAG).**

The main difference between RAG and CAG:

- RAG relies on external knowledge base (e.g. in-memory DB, Vector DB, etc.).
- CAG bypasses this by precomputing KV values for the entire knowledge base and caching them in a KV cache. This entire knowledge base is then used during inference.

Traditional RAG

1. Query submitted
2. Relevant documents retrieved from VectorDB
3. Retrieved documents appended to the query as context

Characteristics:

- Retrieves only subset of documents relevant to the query
- Retrieved documents and query must fit within the model's context window

Problems:

- Retrieval Latency
- Retrieval Inaccuracies
- Context length limits

CAG

1. At index time, knowledge base is tokenized and then KV values for every token is precomputed and stored in the KV cache
2. At query time, the query vector interacts with the ENTIRE knowledge bases KV values which are stored in the cache for quick retrieval

Characteristics

1. Precomputed Knowledge Base (KV values of every indexed token is calculated up front)
2. This is unique because we bypass traditional context length limits, because the entire knowledge base is accessible via KV cache. So it falls outside the model architecture allowing model to use more than its context limit.

Benefits

1. No Retrieval Latency
2. No Retrieval Error (since all knowledge is preloaded), but low-quality or off-topic data in the knowledge base can degrade results
3. CAG indirectly bypasses model context length limits, as the precomputed KV cache stores the entire knowledge base, allowing the model to attend to it without appending raw text to the query

Problems

1. High compute cost as attention must process the query against the ENTIRE precomputed KV cache knowledge base
2. High memory cost as precomputing and storing KV caches for large knowledge bases requires significant storage and memory
3. No filtering during inference means if theres erroneous or outlier data in the knowledge base, it can degrade the quality of the generated response

#### **Comparison**

| **Feature**          | **Traditional RAG**                        | **Cache-Augmented Generation (CAG)**              |
| -------------------- | ------------------------------------------ | ------------------------------------------------- |
| **Knowledge Access** | Real-time retrieval from a knowledge base. | Preloaded KV cache for the entire knowledge base. |
| **Context Length**   | Limited to query + retrieved documents.    | Full knowledge base is accessible via KV cache.   |
| **Latency**          | Includes retrieval time.                   | No retrieval latency.                             |
| **Accuracy**         | Depends on retrieval quality.              | Holistic access to precomputed knowledge.         |
| **Compute Cost**     | Lower (limited context).                   | Higher (query attends to entire knowledge base).  |
| **Memory Use**       | Minimal (retrieved subset only).           | Higher (KV cache for all documents).              |

Personal opinion

In theory,

- RAG is best for large, dynamic knowledge bases.
- CAG is ideal for tasks with small, static, relevant knowledge bases.

My concern however:

I believe, practically, precomputing KV values isn’t straightforward for all model architectures. For models like GPT KV values are not modular by default.

To enable precomputing KV values, the model architecture has to also be modified to

- Allow preloading static KV representation from an external source (in this case the KV cache).
- Attention mechanism of the model must also be changed to attend to both dynamically generated query values as well as preloaded KV values.

So custom integration would be required for every model...and of course there is the memory and compute challenges if your knowledge base becomes too large...at some point it would make sense to switch to traditional RAG from there.


[[AI]]  [[Inference]] [[RAG]]