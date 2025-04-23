---
publish: true
---


Video https://www.youtube.com/watch?v=0O_06RNEiL4
Vanilla scheduler is becoming insufficient for more diverse workloads

Advanced Scheduling Requirements
Gang scheduling
Topology-awareness
GPU Bin-Packing
etc.


Scheduling Framework offers plugins/endpoints for building custom schedulers - we can leverage this to make different types of schedulers.

There are different methods for extending the vanilla scheduler
- Modify the scheduler directly (ad-hoc)
- Use webhook extensions to extend the scheduler (Very limited extension points, postfilter, postscore) - low performance due to latency added by webhooks
	- In this approach there is very limited extension points unlike the scheduling framework that has plugins, this approach works via HTTP webhooks, meaning main scheduler calls external service at only a handful of stages (e..g postfilter, postscore)
- Multiple schedulers - Running multiple independent schedulers - this can cause conflicts with other schedulers, has high overhead, and can cause conflicts (multiple schedulers competing for resources) - medium performance - this requires recompiling a separate binary for each scheduler
- Scheduling Framework - in this approach you write lightweight plugins that extend the default scheduler the plugins can hook into any stage - you do need to recompile the scheduler but its still just one scheduler running

In essence approaches three and four are similar 
- One should aim to use approach four using a single scheduler with multiple plugins to avoid needing to run different schedulers. However if different schedulers are absolutely needed you would recompile approach four multiple times (one for each custom scheduler)
- Approach there is an older way to solve the problem as it may not even involve plugins its just completely new binaries recompiled and running concurrently.

### **⏳ So, When Do You Need to Recompile?**

| **Action**                                                                                                                                               | **Recompilation Required?** | **Why?**                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------ |
| Writing a new plugin inside the scheduler code (like hardcoding a plugin inside the scheduler that must be run in a certain stage across all schedulers) | ✅ Yes                       | The scheduler binary must include the new plugin       |
| Modifying an existing plugin inside the scheduler code                                                                                                   | ✅ Yes                       | The binary must be updated                             |
| Enabling/disabling an already-compiled plugin via config                                                                                                 | ❌ No                        | The plugin is already built; just update the config    |
| Changing a plugin running as an external gRPC service                                                                                                    | ❌ No                        | The scheduler is unchanged; the plugin runs separately |



A single scheduler with "multiple plugins" could be like the following:

Custom filtering for CPU vs. GPU workloads

Example Code for a Custom Plugin (CPU vs. GPU Filtering)

```go
type CustomFilterPlugin struct{}

func (p *CustomFilterPlugin) Filter(ctx context.Context, state *framework.CycleState, pod *v1.Pod, nodeInfo *framework.NodeInfo) *framework.Status {
    // Check pod labels or resource requests
    if val, exists := pod.Labels["workload-type"]; exists {
        if val == "CPU-intensive" {
            if !nodeHasEnoughCPU(nodeInfo) {
                return framework.NewStatus(framework.Unschedulable, "Node lacks CPU resources")
            }
        } else if val == "GPU-intensive" {
            if !nodeHasGPU(nodeInfo) {
                return framework.NewStatus(framework.Unschedulable, "Node lacks GPU resources")
            }
        }
    }

    return framework.NewStatus(framework.Success, "")
}

// Helper functions to check resources
func nodeHasEnoughCPU(nodeInfo *framework.NodeInfo) bool {
    return nodeInfo.Allocatable.MilliCPU >= 2000 // Example threshold
}

func nodeHasGPU(nodeInfo *framework.NodeInfo) bool {
    for _, device := range nodeInfo.Node().Status.Capacity {
        if strings.Contains(device.String(), "nvidia.com/gpu") {
            return true
        }
    }
    return false
}
```

CPU & GPU Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cpu-workload
  labels:
    workload-type: "CPU-intensive"  # This is what the scheduler plugin reads
spec:
  containers:
    - name: app
      image: my-app
      resources:
        requests:
          cpu: "2"

---

apiVersion: v1
kind: Pod
metadata:
  name: gpu-workload
  labels:
    workload-type: "GPU-intensive"
spec:
  containers:
    - name: app
      image: my-gpu-app
      resources:
        limits:
          nvidia.com/gpu: "1"  # This will trigger GPU filtering

```

Scheduling for StatefulPod
Say we have a static IP address and we want to ensure a pod lands on the node/rack with this IP, how to handle this

Prefilter stage (gathers relevant info before node filtering happens)
First it syncs IP reservation information - fetches IP allocation details using the node/pod informer - also checks to see if pod is stateful and requires IP reservation 

Filter stage here checks pod requirements and checks if the node has free IP addresses available.

Note prefilter runs once per pod scheduling attempt (fetches global data that all filter calls can use) - filter stage runes for every node, meaning if you have 1,000 nodes filter function runs 1,000 times for a single pod - this is why prefilter reduces redundant API queries when evaluating many nodes.

Gang Scheduling (all or nothing scheduling)
Coscheduling plugin

1. Ensure pods of same pod group are scheduled together (sort stage)
2. Create or update PodGroup if not present and validate if the total number of pods belonging to podgroup reaches minAvailable (prefilter) 
3. Unreserve if the waiting pods exceed timeout limit (reserve)
4. PodGroup meets minAvailable allow the pods of the PodGroup to get scheduled - otherwise put the pod in waiting state (permit)

Also need a PodInformer for PodGroup to get cleaned up or updated


Future features
Custom preemption (if evict one pod in podgroup, should we evict all pods in podgroup)
Reservation with backfill - say two podgroups are waiting for resources, one smaller, one larger. Reservation with backfill allows the smaller podgroup to temporarily be scheduled while waiting for the larger podgroup to be scheduled. When larger group ready it preempts the smaller group
Generic sorting plugins - treat sorting of pods and podgroups as same thing - no custom logic needed

For very large clusters say hundreds, thousands or even tens of thousands of nodes the kubernetes scheduler is limiting as it schedules pods by pods - these clusters deal with autoscaling and so having each pod evaluated against thousands of nodes becomes infeasible/slow.

Optimizations for large clusters
Customizing scheduler parameters
- percentageOfNodesToScore - score a percentage of nodes and rank those for scheduling as opposed to scoring all nodes - this parameter can be set per scheduling profile - score **defaults to 50% of nodes** if there are **more than 100 nodes**

Group Scoring
Score a group of pods with identical resource requirements at same time -
sorting all pods at sort stage is more efficient (PodGroupSort - this is a custom scheduling plugin implemented in custom schedulers like Volcano or via custom kubernetes scheduler plugins)  - because it allows us to do scheduling steps altogether for the entire group - as opposed to say scoring for each pod separately

Now we score nodes for a single pod in the group - then we assign the top k scoring nodes to the k pods

If multiple plugins are enabled in a stage, they run sequentially in a predefined order

PluginConfig allows passing addtional args to a plugin




Performance difference between using the Scheduler Webhook Extender and Plugin is drastic. 

![[Pasted image 20250217163206.png]]

- A **Predicate Extender** (which is webhook-based) can take **up to 50% of the scheduling algorithm duration**.
- A **FilterPlugin** (which is a scheduler plugin-based approach) takes only **up to 4% of the scheduling algorithm duration**.

Coscheduling





### Informers (Pod & Node)
Pod informer tracks pod states, assignments and metadata (e.g. does this pod already have a reserved IP)
Node Informer tracks nodes availability, capacity, labels and conditions (e.g. does this node have enough IPs)

Informers are always running in the background - keeping an up-to-date cache of kubernetes objects. They help reduce API server load by allowing the scheduler to use local data instead of making constant queries.


Default kubernetes informers run in the scheduler - k8s scheduler itself is a controller that contains informers to watch nodes, pods, and persistent volumes. These informers are started inside the scheduler process itself.

There are other default informers: 

| **Kubernetes Component**  | **Which Controller Runs the Informer?** | **What it Watches?**      |
| ------------------------- | --------------------------------------- | ------------------------- |
| **Scheduler**             | Scheduler Controller                    | Pods, Nodes, PVs          |
| **Kubelet**               | Kubelet Controller                      | Pods assigned to the node |
| **ReplicaSet Controller** | ReplicaSet Controller                   | ReplicaSets, Pods         |
| **Custom Controller**     | Custom Controller                       | Any CRD or object         |

Informer does not exist for CRD by default, you must explicitly create it in your custom controller.

How to create an informer for a CRD - TODO: Dynamic vs typed client in kubernetes? DynamicSharedInformerFactory vs. Typed client 
### Client-go vs. Controller-runtime
There is overlapping functionality between these two libraries. client-go is a lower level library than controller-runtime

| Feature                | `client-go`                                                                  | `controller-runtime`                                       |
| ---------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Purpose**            | Low-level library for interacting with the Kubernetes API                    | Higher-level framework for building Kubernetes controllers |
| **Complexity**         | Requires more boilerplate code                                               | Provides abstractions to simplify controller development   |
| **Use Case**           | Direct interaction with Kubernetes API (CRUD operations, watches, informers) | Building custom controllers and operators                  |
| **Informer Handling**  | Manually managed informers and watches                                       | Uses Manager pattern for automatic lifecycle management    |
| **Reconciler Pattern** | Not built-in, needs manual implementation                                    | Provides built-in reconcile loops                          |
| **Dependency**         | Core Kubernetes library, used by Kubernetes itself                           | Built on top of `client-go`, simplifies controller design  |
| **RBAC Handling**      | Needs manual configuration                                                   | Integrates with RBAC settings automatically                |
- If **you need fine-grained control over Kubernetes API interactions**, `client-go` is the way to go.
- If **you are building a custom controller/operator**, `controller-runtime` makes it much easier to manage.
Client-go call

```
clientset.CoreV1().Pods(pod.Namespace).Patch(
    context.TODO(),
    pod.Name,
    metav1.TypeMergePatchType,
    patch,
    metav1.PatchOptions{},
)
```

```
r.client.Get(ctx, req.NamespacedName, &pod)
```

Controller-runtime is generally more efficient for controllers
### **Comparing Both Approaches**

|Feature|`client-go` (`clientset`)|`controller-runtime` (`client`)|
|---|---|---|
|API Call Type|Direct API requests|Uses cached client with lazy loading|
|Efficiency|Less efficient (every call hits API server)|More efficient (uses informers & local cache)|
|Use Case|One-off scripts, CLI tools, direct API interactions|Controllers, operators, reconciliation loops|
|Code Complexity|Requires manually handling watches and sync|Manages lifecycle and reconciliation|

### **When Should You Use `client-go` vs. `controller-runtime`?**

| **Scenario**                                       | **Use `client-go`**     | **Use `controller-runtime`** |
| -------------------------------------------------- | ----------------------- | ---------------------------- |
| Writing a Kubernetes controller/operator           | 🚫 Not ideal            | ✅ Best approach              |
| One-time script or tool                            | ✅ Simple and direct     | 🚫 Overkill                  |
| Making API requests without a long-running process | ✅ Best fit              | 🚫 Not needed                |
| Automating Kubernetes object reconciliation        | 🚫 Too much manual work | ✅ Handles it automatically   |

- **`client-go` (`clientset`)**: Direct API calls every time → **better for short-lived tasks**.
- **`controller-runtime` (`client`)**: Uses a cached client → **better for long-running controllers**.



[[kubernetes]] [[kubernetes scheduling]]