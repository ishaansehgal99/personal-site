---
publish: true
---

#### Karpenter works alongside the k8s scheduler

The default Kubernetes scheduler is responsible for placing pods onto existing nodes as it does. Karpenter on the other hand is responsible for provisioning new nodes when the existing cluster capacity can't accomodate pending pods. 

It kicks in when it finds unscheduable pods. After Karpenter provisions new nodes then still relies on the kubernetes scheduler to actually place the pods onto those newly created nodes. Karpenter doesn't make pod placement decisions itself.

#### Karpenter Bin-Packing Engine

While karpenter doesn't directly use k8s scheduler nor does it extend scheduler extensions. It does use its own internal scheduling simulation to make node provisioning decisions. 

https://github.com/kubernetes-sigs/karpenter/tree/main/pkg/controllers/provisioning/scheduling

This code contains Karpenter's internal scheduling simulation. Karpenter's Binpacking engine roughly performs the following to figure out what nodes to provision. 
1. Groups unschedulable pods together based on shared scheduling constraints (resource requirements, node selectors, affinities, and tolerations), 
2. Evaluates potential instances that could be created for each group
3. Then using bin-packing algorithms, karpenter aims to maximize resource utilization by fitting as many pods as possible into the fewest number of nodes, thereby reducing waste and cost.
4. Once optimal configurations are determined, Karpenter provisions the necessary nodes

But its important to remember that karpenter doesn't perform the actual scheduling itself, rather once it determines the optimal nodes to create, it cannot change the labels on the pod. It can however set labels on the nodes it spins up itself which can influence scheduling. But it doesn't actually perform the binding, that is still done by the k8s scheduler itself. 

[[kubernetes]] [[kubernetes scheduling]] [[karpenter]]