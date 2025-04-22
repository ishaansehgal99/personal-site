
## Optimizing Memory Usage in LLM Fine-Tuning with Kaito: Lessons from Phi-3-mini

Large Language Models have revolutionized AI capabilities, but fine-tuning these massive models efficiently remains a significant challenge. In this post, we share practical insights from our experiments fine-tuning Microsoft's Phi-3-mini-128k model using Kaito, Microsoft's open-source Kubernetes-native platform for AI workloads.

## Understanding the Challenge
Phi-3-mini-128k is a 3.8 billion parameter model (14.6 GB) with a parameter distribution following the common transformer ratio of approximately 1:2 between attention (31.6%) and MLP components (63.2%). While both 4k and 128k variants have identical parameter counts, the 128k version uses scaled rotary embeddings to support longer contexts.

When fine-tuning LLMs, memory becomes the primary bottleneck, especially when working with longer sequences or limited hardware resources. Our experiments revealed critical differences between inference memory patterns (roughly linear with sequence length) and fine-tuning memory patterns (non-linear growth that can quickly exhaust GPU resources).

## Key Memory Optimizations

Our experiments with Phi-3-mini-128k on NVIDIA A100 (80GB) GPUs revealed several effective strategies for optimizing memory usage during fine-tuning:

### 1. Precision Format Selection
The choice of precision format dramatically impacts memory requirements:

| Precision Format       | Memory Usage |
| ---------------------- | ------------ |
| Float32                | 15.73 GB     |
| Float16/BFloat16       | 8.09 GB      |
| 8-bit Quantized (INT8) | 4.64 GB      |
| 4-bit Quantized (INT4) | 3.00 GB      |

Appropriate quantization and precision settings can reduce memory requirements by up to 80% compared to full precision. In Kaito, you can implement this with simple configuration:

```yaml
ModelConfig:
  torch_dtype: "bfloat16"  # Options: float32, float16, bfloat16

QuantizationConfig:
  load_in_4bit: true       # Enable 4-bit quantization
  bnb_4bit_quant_type: "nf4"
  bnb_4bit_compute_dtype: "bfloat16"
  bnb_4bit_use_double_quant: true
```

### 2. LoRA vs. QLoRA

Standard LoRA (16-bit precision) memory grows non-linearly with sequence length, reaching >80GB at just ~3,500 tokens, while QLoRA maintains a much more stable profile. Our measurements showed:

- QLoRA with 4-bit precision reduced memory usage by approximately 75% compared to standard LoRA
- This trade-off introduces a moderate reduction in processing speed due to dequantization overhead
- QLoRA enables fine-tuning with much longer sequences within the same memory constraints

The fundamental choice: LoRA uses full-precision weights for faster computation but requires more memory, while QLoRA stores weights in 4-bit format for drastically reduced memory usage with some performance overhead.

```yaml
QuantizationConfig:
  load_in_4bit: true
  bnb_4bit_quant_type: "nf4"
  bnb_4bit_compute_dtype: "bfloat16"
  bnb_4bit_use_double_quant: true
```

### 3. Batch Size Optimization
Contrary to intuition, increasing batch size showed multiple benefits:
- More efficient memory usage per total tokens processed
- Higher training throughput (more tokens processed per second of compute time)
- Better utilization of computational resources

While batch size 1 handles the longest individual sequences, larger batch sizes (2-4) offer a better balance of speed and memory efficiency when working with a fixed token budget. This means your training completes faster while using resources more effectively.

```yaml
TrainingArguments:
  per_device_train_batch_size: 2  # Adjust based on your sequence length needs
```


### 4. LoRA Rank and Target Module Selection

Our evaluation of LoRA with various rank values (8, 16, 64, 256, and 16384) showed:
- Ranks 8-256 demonstrated minimal differences in memory usage and processing speed
- Very high ranks (e.g., 16384) significantly increased memory requirements and reduced speed

We also compared targeting only attention layers versus targeting both attention and MLP layers:
- Memory impact was minimal between different targeting strategies
- Focusing on attention layers alone (about 0.04% of parameters) required fewer trainable parameters than including MLP layers (about 0.12% of parameters)

This suggests an efficient starting configuration for memory optimization:

```
LoraConfig:
  r: 8  # Good baseline; increase if needed for model quality
  lora_alpha: 8
  lora_dropout: 0.0
  # Optional: target only attention components for maximum efficiency
  target_modules: ["q_proj", "k_proj", "v_proj", "o_proj"]
```

### 5. PyTorch Memory Management

Setting `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` significantly reduced reserved memory without affecting processing speed. This optimization is now enabled by default in Kaito.

## Practical Recommendations

Based on our experiments with Phi-3-mini-128k, we recommend the following approach for efficient fine-tuning with Kaito:

1. **Start with QLoRA** for memory-efficient fine-tuning, especially with longer sequences or limited GPU resources
2. **Optimize batch size** rather than defaulting to batch size 1. For many scenarios, a larger batch size processing the same total tokens will be more efficient
3. **Keep LoRA rank values modest** (typically 8-64) unless higher ranks significantly improve model quality for your specific task

## Complete Kaito ConfigMap Example

Here's a complete ConfigMap incorporating our recommended optimizations:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: optimized-phi3-tuning
  namespace: kaito
data:
  training_config.yaml: |
    training_config:
      ModelConfig:
        torch_dtype: "bfloat16"
        local_files_only: true
        device_map: "auto"
    
      QuantizationConfig:
        load_in_4bit: true
        bnb_4bit_quant_type: "nf4"
        bnb_4bit_compute_dtype: "bfloat16"
        bnb_4bit_use_double_quant: true
    
      LoraConfig:
        r: 8
        lora_alpha: 8
        lora_dropout: 0.0
        target_modules: ["q_proj", "k_proj", "v_proj", "o_proj"]
    
      TrainingArguments:
        output_dir: "/mnt/results"
        save_strategy: "epoch"
        per_device_train_batch_size: 2
        ddp_find_unused_parameters: false
    
      DataCollator:
        mlm: true
    
      DatasetConfig:
        shuffle_dataset: true
        train_test_split: 1
```


## Conclusion
Efficiently fine-tuning LLMs requires understanding the complex interplay between model architecture, memory management, and training dynamics. Our experiments demonstrate that with the right combination of techniques—particularly QLoRA, optimized batch sizes, and appropriate LoRA configurations—it's possible to fine-tune powerful models like Phi-3 with reasonable hardware requirements.

By implementing these optimizations in Kaito, you can work with larger models and longer sequences, even with limited computational resources, advancing the accessibility and practical application of state-of-the-art language models in your projects.

_This research was conducted using NVIDIA A100 (80GB) GPU, CUDA: 12.4, PyTorch: 2.2.0_