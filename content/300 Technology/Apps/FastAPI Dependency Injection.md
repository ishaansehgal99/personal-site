---
publish: true
---
In FastAPI you can do dependency injection like so

```python
async def k8s_get_documentation(
	request: K8sDocRequest, # ← From request body
	api_key_data: Dict[str, Any] = Depends(validate_api_key) # ← FastAPI magic!
):
```

The client doesn't send api_key_data! Here's what actually happens:

### 1. Client Sends Simple HTTP Request
```js
const response = await fetch(`${BASE_URL}/api/kubernetes/documentation`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"x-api-key": "gd_abc123..." // ← Only this!
	},
	body: JSON.stringify({ query: "...", version: "..." })
});
```

### 2. FastAPI Receives Raw HTTP Request

FastAPI gets:
- Headers: { "x-api-key": "gd_abc123...", "Content-Type": "..." }
- Body: { "query": "...", "version": "..." }
- URL: /api/kubernetes/documentation


### 3. FastAPI Sees Depends(validate_api_key)

Before calling your endpoint, FastAPI automatically:
1. Creates request object from the raw HTTP request
2. Calls validate_api_key(request, credentials)
3. Takes the return value and assigns it to api_key_data


## How validate_api_key Parameters Get Populated

```python
async def validate_api_key(
    request: Request, # FastAPI provides this
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security) # HTTPBearer provides this
) -> Dict[str, Any]:
```

- request: FastAPI automatically creates this from the incoming HTTP request
- credentials: The HTTPBearer() security scheme extracts this from the Authorization header (if present)

```txt
📱 Client sends:
   POST /api/kubernetes/documentation
   Headers: { "x-api-key": "gd_abc123..." }
   Body: { "query": "..." }

⬇️

🔧 FastAPI automatically:
   1. Creates Request object from HTTP request
   2. HTTPBearer extracts credentials (if any)
   3. Calls: validate_api_key(request, credentials)

⬇️

🔍 validate_api_key function:
   1. Gets API key: request.headers.get("x-api-key")
   2. Validates against database
   3. Returns: { "user_id": "...", "usage_count": 5, ... }

⬇️

🎯 FastAPI assigns return value to api_key_data:
   api_key_data = { "user_id": "...", "usage_count": 5, ... }

⬇️

🚀 Your endpoint runs with populated parameters:
   k8s_get_documentation(request=..., api_key_data=...)
```


## Dependency Injection Pattern

This is FastAPI's dependency injection:

```python
# This:
api_key_data: Dict[str, Any] = Depends(validate_api_key)

# Is equivalent to:
# api_key_data = await validate_api_key(request, credentials)
# (but FastAPI handles it automatically)
```

The client never knows about `api_key_data`- it's purely a server-side construct created by the dependency injection system! 🎯