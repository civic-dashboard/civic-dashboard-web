# Architecture

The app currently consists of:

- A Next app deployed on Cloudflare Workers, which queries
- A Postgres database hosted on Sevalla, which is updated by
- Some data pipelines which run in GitHub Actions workers
- An external email provider (currently Resend) which we interact with API

## Next app

Architecturally, you can think of a Next app similarly to other backend web servers like Express or Django. When a request is received, the routing logic you implement will decide which code responds to that request, and it may respond with static files or by generating the response on-demand. Here are some things that make a Next app different from traditional backend web servers:

- Next uses file-based routing, so the logic of which code responds to which requests is determined by the folder structure of the `app` directory in the repo. [Next docs on routing](https://nextjs.org/docs/app/building-your-application/routing).
- Unless you give it explicit instructions, Next will decide _implicitly_ what strategy it will use to render a response for a route based on the implementation of the handler for that route, whether that be statically rendered at build time, rendered on-demand but cached, or re-rendered on every request. [Next docs on rendering](https://nextjs.org/docs/app/building-your-application/rendering#rendering-environments).
- Webpages are created using `page.tsx` files, and Route Handlers (for APIs etc) are created using `route.ts` files. [Next docs on project structure](https://nextjs.org/docs/app/getting-started/project-structure).
- You can also create "[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)". These are functions which run in the backend but can be invoked from the frontend. Scary!
- There are other Next features which we aren't currently using and so aren't documented here.

## Database

There isn't too much to say about the database architecturally! We write queries and manage migrations using [kysely](https://github.com/kysely-org/kysely), a TypeScript based type-safe SQL query builder.
