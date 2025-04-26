---
publish: true
---

These language models operate similarly to RAG. These models will gather external information sources using knowledge graphs (KGs) - instead of just solely relying on model weights. 

Just like how RAG avoids hallucinations by retrieving relevant context at inference time, this paper feeds in structured data (KGs) dynamically during QA, rather than relying on pretraining alone.

#### **Post-training / Fine-tuning (one-time setup per task)**

- You build a new model that **combines**:
    - A **pretrained LM** (e.g., frozen or fine-tuned BERT)
    - A **GNN** to encode the knowledge graph (usually trained from scratch)
        
- You **train this combo model** using a dataset of:
    - A **natural language question**
    - A **corresponding knowledge graph**
    - A **label** (e.g., TRUE or FALSE)
        
- During training:
    - The LM encodes the question
    - The GNN encodes the graph
    - You fuse these representations (e.g., via concatenation)
    - A classifier predicts TRUE/FALSE

### Summary Table

| Stage             | What's happening                                  | When does it happen?             |
| ----------------- | ------------------------------------------------- | -------------------------------- |
| **Pretraining**   | Train LM on large text corpora                    | Once (before anything else)      |
| **Post-training** | Train a model to combine LM + GNN on labeled data | Once per task (before inference) |
| **Inference**     | Use the trained model to answer new questions     | Every time you run the model     |

https://arxiv.org/pdf/2406.04989

[[AI]]


