---
publish: true
---

Traditionally, CNI plugins like Flannel and Calico configure routes or iptables on each node to enable pod-to-pod communication across nodes. The CNI plugin ensures that traffic destined for a Pod IP on a different node is routed appropriately, often using Linux routing tables, encapsulation (VXLAN, IP-in-IP), or BGP

NAT is the process of translating one IP to another IP address using a mapping. It modifies the IP address in packet headers as data moves between networks. 

## Cillium

Cillium is a CNI plugin that provides networking and security for pods in k8s. Instead of relying on iptables it uses eBPF programs in the linux kernel to handle packet forwarding, network policy enforcement and other functionality at a very low level. 

Cillium Agent - runs as Dameonset on every node
- Is responsible for setting up eBPF programs
- Communicates changes in pods/services/endpoints.

Cillium Operator
- Runs as a deployment - and performs cluster-wide tasks (like managing IP address allocations) and helps distribute state. 

The way it works in Cillium is like this: 
pod initiates a connection 
-> eBPF on the local node performs NAT translation to find the destination pod address
-> if the destination pod is local, eBPF sends the packet locally 
-> if the pod is remote, eBPF encapsulates and sends it across the network 
-> on the remote node, eBPF decapsulates the packet, looks up reverse NAT entries, and delivers it to the destination pod 
-> the same path is followed in reverse for the response

**Most Cilium users configure Cilium as a complete replacement for kube-proxy** to take advantage of the eBPF-based service handling

*Note: CNI plugins do not interfere with Kube-Proxy which is responsible specifically for Service-Based traffic, not pod-to-pod networking.*


[[kubernetes]] [[Kubernetes Networking]] [[Networking]]