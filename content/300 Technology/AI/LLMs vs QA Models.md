---
publish: true
---

Something I was wondering recently is whats the difference between a QA model and a model like GPT. The truth is QA models are focused specifically on question answering task. As opposed to open ended generalist GPT which can do things like
- Generate text
- Hold conversations
- Translate languages
- Summarize Content
- Write stories, code, emails, poems - etc.

Differences 

| Feature               | Traditional QA Model (like BERT + SQuAD)   | ChatGPT                                                         |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| **Primary Purpose**   | Extract answer spans from context          | General-purpose language generation                             |
| **Input Requirement** | Needs context + question                   | Can answer with or without context                              |
| **Memory**            | Stateless (answers one question at a time) | Conversational memory (keeps chat history)                      |
| **Output Type**       | Usually short answer spans                 | Long-form, flexible, human-like responses                       |
| **Training**          | Fine-tuned on QA datasets                  | Trained on massive text + fine-tuned with RLHF (human feedback) |

Something to note is that an LLM can be considered a QA model but an LLM isn't just a QA model.

[[AI]] [[LLM]]