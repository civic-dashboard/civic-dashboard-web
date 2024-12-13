# 🚧 Architecture 🚧

Wanna say more about what "a Next app" means architecturally, but will do that later! Poke on slack if you're curious

Right now, it's a Next app deployed on Cloudflare Workers. When you visit a page, a server somewhere loads the code for the app, and responds with that page (which could mean just delivering some statically rendered files, or could mean generating a new page at the time of the request). There are also ways to interact with the Next app which do not return a new page: Route Handlers and Server Actions. We use these to e.g. send an email, or return some data to the client without them navigating to a new page (say, fetch some search results (not yet implemented)). We also have external API dependencies for email. And that's it, there's no DB yet!
