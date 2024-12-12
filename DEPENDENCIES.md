# Dependencies

This file comprehensively lists the dependencies of the project, and why they are used!

## Core dependencies

- `next` is our framework of choice
- `react` and `react-dom` are the core react dependencies
- `typescript` provides static typing for the project. `@types/*` packages provide types for specific dependencies

## Deployment/ops

- `@opennextjs/cloudflare` and `wrangler` are needed to deploy the app to Cloudflare
- we also use GitHub actions for CI, these files can be found in `.github/workflows`

## Emails

- `resend`, `react-email`, and `@react-email/components` are used for sending emails

## UI

- We use `shadcn/ui` as our component framework. It takes a unique approach where it simply inlines the code for the components you use into the library, so there's no direct dependency on it. But it installs several transitive dependencies
  - `tailwindcss` is the core styling framework
  - `lucide-react` provides icons
  - `@radix-ui/*` and `cmdk` are headless components
  - `postcss`, `clsx`, `class-variance-authority`, `tailwind-merge`, and `tailwindcss-animate` are various styling utility packages

## Local search

- `flexsearch` powers the local search
- `mark.js` powers the search term highlighting

## Dev experience

- All `eslint` related dependencies and `prettier` are for ensuring our codebase has consistent best practices and code style
