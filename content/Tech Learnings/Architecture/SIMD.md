---
publish: true
---
SIMD stands for Single instruction multiple data. 

With SIMD the CPU can operate on multiple pieces of data in parallel using the same instruction. Like vectorized operations. Here is a quick breakdown

Say we have two arrays
```
A = [1, 2, 3, 4]
B = [5, 6, 7, 8]
```

With **SIMD**, the CPU can process multiple additions in parallel using a **single instruction** — for example, adding all 4 pairs in one go if the vector register supports 4 integers.

You need hardware support for SIMD, special **SIMD registers** perform the parallel operations.

Modern compilers can **automatically detect** simple patterns like loops and **apply SIMD vectorization** when safe automatically:
```
for (int i = 0; i < N; ++i) {
    C[i] = A[i] + B[i];
}
```


SIMD registers can be **64, 128, 256, or 512 bits** wide. These are split into **lanes**, typically **32 bits wide** when working with single-precision floats.

For example:
```
__m256 a = _mm256_loadu_ps(A);
__m256 b = _mm256_loadu_ps(B);
__m256 c = _mm256_add_ps(a, b);
```
This splits A and B into 8x32-bit wide lanes which get added in parallel.

### Real-World Use
- Libraries like Eigen, OpenCV, TensorFlow, or PyTorch use SIMD under the hood for fast math.
- GPUs also use SIMD-like concepts but at larger scales (SIMT - Single Instruction, Multiple Threads)

[[Computer Architecture]]