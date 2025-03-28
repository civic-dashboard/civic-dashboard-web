# Dependencies

This file comprehensively lists the dependencies of the project, and why they are used!

## Core dependencies

- `next` is our framework of choice
- `react` and `react-dom` are the core react dependencies
- `typescript` provides static typing for the project. `@types/*` packages provide types for specific dependencies

## Deployment/ops

- `@opennextjs/cloudflare` and `wrangler` are needed to deploy the app to Cloudflare
- we also use GitHub actions for CI, these files can be found in `.github/workflows`. We use `tsx` as our script runner.

## Emails

- `react-email`, and `@react-email/components` are used for constructing email content.
- `resend` is our prod email provider.
- `nodemailer` and `maildev` are used for previewing emails in development.

## UI

- We use `shadcn/ui` as our component framework. It takes a unique approach where it simply inlines the code for the components you use into the library, so there's no direct dependency on it. But it installs several transitive dependencies
  - `tailwind` is the core styling framework, and has a few related packages.
  - `lucide-react` provides icons
  - `@radix-ui/*` and `cmdk` are headless components
  - `postcss`, `clsx`, and `class-variance-authority` are styling utility packages
- `react-intersection-observer` gives us an easy-to-use API for checking if a DOM element is in the viewport

## Database

- All `kysely` and `postgres` related packages are used for the database.
- `hash-sum`, `csv-parse`, and `slugify` are used for various backend data-munging purposes.

## Search

- `mark.js` powers the search term highlighting

## Dev experience

- All `eslint` related dependencies and `prettier` are for ensuring our codebase has consistent best practices and code style
