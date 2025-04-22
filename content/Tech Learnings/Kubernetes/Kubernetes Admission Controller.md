Admission controller is a kubernetes component that intercepts API requests before they are stored in etcd (the k8s database). 

Admission controller can either be 
- Mutuating Admissions Controller -> Modifies incoming requests (e.g. adding labels, setting default values)
- Validating Admission Controller -> Rejects requests that don't meet policies (e.g. blocking privelged pods)


### Example: Mutating Webhook That Adds a Label to All Pods

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
metadata:
  name: add-labels-webhook
webhooks:
  - name: add-labels.example.com
    admissionReviewVersions: ["v1"]
    clientConfig:
      service:
        name: add-labels-webhook
        namespace: default
        path: "/mutate"
    rules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["pods"]
        operations: ["CREATE"]
    failurePolicy: Ignore
```

- Every time a **pod is created**, the API server calls `/mutate` on the **add-labels-webhook**.
- The webhook **modifies the pod definition** to **add a label**.
- The pod **continues creation with the modified request**.

/mutate web service

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/mutate", methods=["POST"])
def mutate():
    req = request.get_json()
    
    # Define the patch that adds a label
    patch = [{
        "op": "add",
        "path": "/metadata/labels/mutated",
        "value": "true"
    }]

    return jsonify({
        "response": {
            "allowed": True,
            "patchType": "JSONPatch",
            "patch": base64.b64encode(json.dumps(patch).encode()).decode()
        }
    })

app.run(host="0.0.0.0", port=443)
```

### Example: Validating Webhook That Blocks Privileged Pods

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: block-privileged-pods
webhooks:
  - name: block-privileged.example.com
    admissionReviewVersions: ["v1"]
    clientConfig:
      service:
        name: block-privileged-webhook
        namespace: default
        path: "/validate"
    rules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["pods"]
        operations: ["CREATE"]
    failurePolicy: Fail
```
- Every time a **pod is created**, the API server calls `/validate` on `block-privileged-webhook`.
- If the pod has **`securityContext.privileged: true`**, the webhook **rejects the request**.

```python
@app.route("/validate", methods=["POST"])
def validate():
    req = request.get_json()
    pod_spec = req["request"]["object"]["spec"]

    # Check if any container is privileged
    for container in pod_spec.get("containers", []):
        if container.get("securityContext", {}).get("privileged", False):
            return jsonify({"response": {"allowed": False, "status": {"message": "Privileged pods are not allowed!"}}})

    return jsonify({"response": {"allowed": True}})
```


### **Mutating vs. Validating Webhooks: Key Differences**

| Feature                      | Mutating Webhook                                    | Validating Webhook                                                    |
| ---------------------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| **Purpose**                  | Modifies incoming requests                          | Approves or rejects requests                                          |
| **Examples**                 | Injecting sidecars, adding labels, setting defaults | Blocking privileged pods, enforcing labels, requiring resource limits |
| **Hook Type**                | `MutatingWebhookConfiguration`                      | `ValidatingWebhookConfiguration`                                      |
| **Allows Partial Failures?** | ✅ Yes (`Ignore` policy)                             | ❌ No (`Fail` policy)                                                  |
| **Can Modify the Request?**  | ✅ Yes                                               | ❌ No (only allows or blocks)                                          |
### **What Does "Allows Partial Failures" Mean in Webhooks?**

✅ In **Mutating Webhooks**, you can configure Kubernetes to **ignore failures** when the webhook **crashes or becomes unavailable**, allowing the request to proceed.

❌ In **Validating Webhooks**, if a failure occurs and the webhook is **set to "Fail"**, the request is **blocked**, even if the webhook itself is down.

You can of course set a validating webhook to have failure policy of ignore but that defeats the purpose of the validating webhook.


[[kubernetes]]