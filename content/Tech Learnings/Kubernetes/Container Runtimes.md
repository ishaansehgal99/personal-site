Container runtimes manage containers using low-level runtimes, in order to create and run containers.

In Kubernetes, the Kubelet communicates with CRI (Container Runtime Interface) to interact with a container runtime which pulls images, starts and manages containers.   

#### Kubernetes Runtime Flow:
**Kubelet → CRI → High-Level Runtime (containerd, CRI-O) → Low-Level Runtime (OCI-compliant)**

- **High-Level Runtimes:** `containerd` (default), `CRI-O`
- **Low-Level Runtimes (OCI-Compliant):** `runc` (used by Docker & K8s), `crun` (lighter alternative), `Kata Containers` (stronger isolation)


[[kubernetes]]
