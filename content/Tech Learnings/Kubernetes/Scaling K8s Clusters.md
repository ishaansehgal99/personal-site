
As you scale the amount of nodes in your system you would run into a new challenge with APIServer. 

kube-proxy is in charge of mapping services to pod ips. Every time there is a change to a service API Server must send the new endpoints object for that service to every node in the cluster. In the cases that the endpoints object is say of size N nodes. Then we have a O(N^2) operation. 

Important to realize that kube-proxy is watching all services. So every time there is a service update and you are using an endpoints object, service controller updates endpoint object, which API server then sends out to every kube-proxy/node. This is why endpoint slices were introduced - to reduce the overhead of distributing large endpoint objects to every node.

Order of operations goes

new node -> kubelet registers new node -> new pod -> kubelet runs the new pod -> Service controller watches pods and then updates the endpoints object -> SVC Controller sends updated endpoints object to API server which stores it in etcd and then sends an update to all kube-proxies -> each kubeproxy updates 



Endpoint slices has fixed this once previously O(N^2) operation. It does this by splitting the large endpoints list into smaller endpointslices that are relevant. This significantly reduces the size of updates and the number of unnecessary notifications. 


https://openai.com/index/scaling-kubernetes-to-7500-nodes/

[[kubernetes]]