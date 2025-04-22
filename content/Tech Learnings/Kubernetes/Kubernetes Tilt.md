Tilt is a way for live updating controller images and applying their changes. 

Their are types of update with tilt. 

- Controller (Binary) changes
	- If you update just controller code then tilt does not need to change/reapply any helm charts. All tilt does it rebuild the controller binary and then live sync/hot reload it to the container process running the controller binary. For example hot reload of kaito workspace container. The pod does not need restarting. 
- Deployment Manifest Changes
	- Tilt detects changes in deployment spec and re-renders the helm template and applies the updated YAML with `kubectl apply`. Kubernetes detects a change in the Pod spec and will perform a rolling update of the deployment. 
- CRD Changes
	- If you modify CRDs Tilt, re-applies the CRDs with `kubectl apply --server-side -f charts/kaito/workspace/crds` 
- Helm Chart Changes
	- If you modify the helm chart itself (e.g. environment variables, resource requests), Tilt will detect changes in the chart's source. It re-runs helm template to produce new YAML, then does kubectl apply -f new.yaml. That patches the Deployment or other objects as needed. 

It's important to note here the difference between CRD and helm chart changes. 

When you change a CRD file, Tilt triggers that separate "CRD pipeline" (the local resource that calls `make generate && make manifests && kubectl apply`). It doesn't necessarily rerun your entire helm chart templating, unless you specifically wire it to. 

Conversely, if you tweak the normal Helm chart (e.g. a deployment or configmap) that triggers Tilt to run `helm template` again and re-apply the updated YAML - separate from CRD logic. 

[[kubernetes]]