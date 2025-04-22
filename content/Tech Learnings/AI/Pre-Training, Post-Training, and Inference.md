
![[Pasted image 20250329155917.png]]

### **Top bar: Most LLMs

#### **1. Pre-training (gray)**
- **What happens**: GPT-o1 is trained on massive datasets like Common Crawl, books, code, etc., using next-token prediction (autoregressive modeling).
- **Goal**: Learn general world knowledge, language patterns, reasoning abilities, etc.
- **Duration**: Longest phase (uses the most compute and data).
- **Typical data**: Unlabeled web-scale data, often filtered and tokenized.
#### **2. Post-training (light green)**
- **What happens**: This is often called **instruction tuning** or **alignment training**.
    - Fine-tune the pretrained model to follow instructions, using human-written prompts and completions.
    - May include **RLHF** (Reinforcement Learning from Human Feedback).
- **Goal**: Make GPT-o1 more helpful, safe, and aligned with human intent.
    

#### **3. Inference (tiny pink end)**
- **What happens**: You prompt the model with a query (like this conversation), and it generates a response using its frozen, trained weights.
- **No learning happens** here — it’s just forward pass.


### Now with GPT-O1:
### 🍓 Inference-time adaptation with GPT-o1 includes:

- **Memory** (like with OpenAI’s new _memory feature_ for GPTs)
- **RAG systems** that pull in external knowledge dynamically
- **API fine-tuning endpoints** that let you keep evolving the model
- **Agents** that can self-reflect or modify prompts/tools over time
- Possibly **in-context learning loops** or caching tricks to emulate "learning"

### 🚫 What GPT-o1 is _not_ doing:

- No **gradient updates**
- No **weight changes**
- No **permanent new skills learned** unless OpenAI retrains or fine-tunes it centrally

**GPT-o1 does _not_ truly learn during inference**, but through memory, retrieval, and context, it can simulate learning-like behavior. The model itself remains fixed — but it feels smart because of how it’s scaffolded.

https://chatgpt.com/c/67e876d2-67dc-8009-8a02-e03cc207fe00

[[AI]] [[Inference]]