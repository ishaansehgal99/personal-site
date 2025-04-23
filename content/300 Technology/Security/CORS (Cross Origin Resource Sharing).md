---
publish: true
---

CORS is a way of a server permitting requests from clients on different origins. Note requests made from a client on the same origin as the server are always allowed and do not require CORS.

It works via these steps

1. Client (browser) wants to make a cross-origin request
	- A cross-origin request is one where the front end (e.g. http://localhost:3000) calls a backend (e.g. http://api.yoursite.com)
	
2. The browser may send a "preflight" request using the OPTIONS method before the actual request
	- This is to check if the actual request is safe to send
	- It includes headers like:
```
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

Server responds with CORS headers, like:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400  # Optional: cache this for 24 hours
```

Access-Control-Max-Age: 86400 this tells the browser: *"You can reuse this CORS config for the next 24 hours"*

3. If the server approves, the browser proceeds with the actual request.


Just to clarify when the server responds with the allow_headers as seen above it means
```
allow_headers=["Content-Type", "Authorization"]

I, the server, am okay with the client sending custom headers "Content-Type" and "Authorization" in the actual request.

or say

allow_headers=["*"]

I, the server, am okay with the client sending any custom headers in the actual request.
```

https://www.youtube.com/watch?v=4KHiSt0oLJ0&ab_channel=Fireship


[[Networking]] [[Security]]