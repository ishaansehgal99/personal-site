---
publish: true
---
Recently I was using Vercel to deploy a SPA React Application. And I was reminded of how it works.

I found that a Singe Page Application is a web app that loads a single HTML page initially (e.g. `index.html`). And then dynamically updates the content on the page using JavaScript without reloading the whole page. 

It works by managing different routes (URLs like `/home` or `/profile`) on the client side using a JavaScript router (like React Router). 

So, in an SPA:
- There’s just one real HTML file (`index.html`)
- Routing (like `/home`) is handled **inside the JavaScript app**, not by the server

What does that last bullet mean? 

##### 👉 When you go to `/home` in a SPA:
- The server just sends back `index.html` and the JS app.
- Then **React Router** sees `/home`, says “oh! show the HomePage component,” and **renders that component on the page**.
- The server is not involved in figuring out what `/home` means.
    
##### 👉 In a traditional site (non-SPA):
- You visit `/home`
- The browser asks the server, “Hey, give me `/home`”
- The server returns a **completely new HTML file** for that page
- The browser reloads everything

Now back to my situation with my React SPA app hosted on Vercel.

In my case the fix was adding this `Vercel.json` file

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This tells Vercel:

> “Hey, for any route the browser tries to access, serve `index.html` instead, the SPA will handle it from there.”

### Are most modern apps SPAs?

**Yes, most React/Next.js/Vue/Angular frontends are SPAs** — or at least use SPA behavior for dynamic parts. However:

- **SPAs**: Great for app-like behavior, fast navigation
- **Multi-Page Apps (MPAs)**: Better for SEO, simple sites
- **Hybrid**: Frameworks like **Next.js** and **Nuxt** allow combining both


### ✅ TL;DR
- **SPA** = One HTML file, routing done in JS
- You need the `rewrites` rule because **Vercel doesn’t know to serve `index.html` for every route**
- If you're using React Router — yes, your app is an SPA
- SPAs are **common** for apps, especially when using frameworks like React, Vue, and Angular