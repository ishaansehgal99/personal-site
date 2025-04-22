These are both dameonsets that run on each node. 

### Kubelet

Kubelet is responsible for communicating with the API Server. It registers and heartbeats nodes via node leases and ensures that pods assigned to the node are running.

Kubelet watches for changes to PodSpecs (in order to update pods). 

Kubelet also allows us to get pod logs and exec into a pod.

Kubelet also interacts with the container runtime (containerd, CRI-O) via the CRI to pull images, start, and manage containers. Also to manage pod lifecycles, execute liveness/readiness probes, ensure proper mounting of volumes and injection of secrets/configmaps.

### Kube-Proxy
Kube-Proxy acts as a mapping system from services to pods. It listens for the creation of new services. It also dynamically updates NAT rules in **iptables** to route and load balance traffic

It does not handle direct pod-to-pod communication. That's where the CNI comes in. 

Services work by getting a stable ClusterIP (virtual IP) that clients use. Kube-proxy then works by setting up iptables or IPVS rules that map: 

```
Service Cluster IP -> One of the Pod IPs backing that service
```

### Summary
- kube-proxy handles service-to-pod routing by setting up the iptables/IPVS rules
- Pod-to-pod networking is handled by the CNI (Flannel, Calico, etc.)
- Pods can talk directly using their private IPs, but they need a CNI to ensure cross-node communication


#### **Pod-to-Pod** Communication

| **Scenario**                                      | **Without CNI?** | **With CNI?** |
| ------------------------------------------------- | ---------------- | ------------- |
| **Pod A → Pod B (same node, using Pod IP)**       | ✅ Works          | ✅ Works       |
| **Pod A → Pod B (different nodes, using Pod IP)** | ❌ Fails          | ✅ Works       |
| **Node A → Pod on Node A (using Pod IP)**         | ✅ Usually works  | ✅ Works       |
| **Node A → Pod on Node B (using Pod IP)**         | ❌ Fails          | ✅ Works       |


[[kubernetes]]