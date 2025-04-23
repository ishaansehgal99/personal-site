---
publish: true
---

Tries are essentially a tree-like data structure used to store strings. It's especially useful for prefix-based lookups. Hence it's also called a prefix tree.

### Implementation

```python
from collections import defaultdict
class TrieNode:
    def __init__(self):
        self.children = defaultdict(TrieNode)
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children[ch]
        node.is_word = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_word

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
```

Example (storing “cat”, “car”, “cap”):
```bash
        root
         |
         c
         |
         a
       / | \
      t  r  p

```


|Operation|Time Complexity|Why?|
|---|---|---|
|Insert|`O(n)`|One pass per character|
|Search|`O(n)`|Traverse down the tree|
|Starts With Prefix|`O(n)`|Just like search but doesn’t check end|
|Delete (optional)|`O(n)`|May include cleanup of unused nodes|


Used for storing dictionary of words with fast prefix lookup. Implementing autocomplete. Solving problems like longest prefix match, word search or IP routing.


[[Data Structures]]