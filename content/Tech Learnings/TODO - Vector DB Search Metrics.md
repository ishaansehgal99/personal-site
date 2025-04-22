


**Euclidean Distance** (a.k.a. L2 norm)
- Measures the **straight-line distance** between two points in space.
- Good when **magnitude (vector length)** matters.

**Cosine Similarity** (and Cosine Distance)
- Measures the **angle** between two vectors, **not** their magnitude.
- Think: How "aligned" or "pointing in the same direction" are these vectors?
- Good when **only direction matters** (e.g., in text embeddings or semantic search).

Figure out

| Use Case                          | Recommended Distance |
| --------------------------------- | -------------------- |
| Image embeddings                  | Euclidean            |
| Text embeddings / semantic search | Cosine               |
| Clustering or t-SNE               | Usually Euclidean    |
| High-dimensional sparse vectors   | Cosine               |