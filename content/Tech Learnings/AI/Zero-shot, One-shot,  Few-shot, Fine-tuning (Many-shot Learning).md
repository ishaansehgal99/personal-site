
### 1. **Zero-shot learning**
- **Definition**: The model performs a task **without seeing any examples** of it beforehand.
- **Example**: You ask a language model to "translate English to French: 'Hello'" without showing it any examples of translations.
- **Key idea**: Relies on generalization and pretrained knowledge.

### 2. **One-shot learning**
- **Definition**: The model is given **one example** of the task before being asked to do a similar one.
- **Example**: You show the model:  
    `"Translate English to French: 'Good morning' -> 'Bonjour'"`  
    Then ask:  `"Translate English to French: 'Hello' -> ?"`

### 3. **Few-shot learning**
- **Definition**: The model is given **a few examples (typically 2-10)** to understand the task before trying it.    
- **Example**: Several input-output pairs are shown before the actual query.

### 4. **Fine-tuning / Many-shot learning**
- **Definition**: The model is trained on **many labeled examples** to learn a task more robustly.
- **Used when**: You want high accuracy and can afford extra computation and data labeling.


[[AI]] [[Inference]]