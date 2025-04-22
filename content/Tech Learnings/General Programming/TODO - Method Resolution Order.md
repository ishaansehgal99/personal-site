

In Python and many other programming languages there is something called MRO. 

When I have a class inheriting multiple parents, we pick the closest inherited parent for determining which function to call. 

Python uses MRO to determine which method to call, the order in which you inherit matters. In this case, the MRO for `LocalHuggingFaceEmbedding` is roughly:

1. `LocalHuggingFaceEmbedding`
2. `HuggingFaceEmbedding`
3. `BaseEmbeddingModel`
4. Other base classes (like `BaseEmbedding`, etc.)

This means that if both parents define a method with the same name (for example, `_aget_text_embedding`), the version in `HuggingFaceEmbedding` is used because it comes first in the MRO.


### C3 linearization algorithm





