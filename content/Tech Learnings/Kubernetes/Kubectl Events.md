
Kubectl events are interesting they are created by various components in k8s. They are sent over to the API server which then sends them over to the ETCD for storage.

These events are ephemeral (default retention ~1 hr) and used for debugging.

Events are registered by 
- kubelet (registering nodes, reporting pod status, watches for changes in pods, logs/metrics/events etc)
-  Control Plane Components (scheduler, controllers, API Server itself)


[[kubernetes]]