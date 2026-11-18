# AGENTS.md

Civic Dashboard is a Next.js app, deployed on Cloudflare Workers, that shows upcoming civic engagement opportunities in Toronto and how to act on them. Data comes from Toronto City Council APIs into a Postgres database through scheduled GitHub Actions jobs. The live site is https://civicdashboard.ca.

For detail, read these instead of guessing:

- [README.md](./README.md): local setup, database, seed data, running the app
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): the production stack
- [docs/CODEBASE.md](./docs/CODEBASE.md): what lives in each directory
- [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md): PR workflow, linting, migrations
- [docs/DEPENDENCIES.md](./docs/DEPENDENCIES.md): why each dependency is here
- [docs/DATASOURCES.md](./docs/DATASOURCES.md): the external data sources
- [docs/WIKI_MEDIA.md](./docs/WIKI_MEDIA.md): wiki pages, images and video

## Setup

Use the Node version in `.tool-versions` and install with `npm ci`. That is enough to run the validation command. Running the app also needs Docker, a local database and a `.env` file, as described in the README.

## Validation

Run `npm run validate` before you consider a change done, and fix everything it reports. It runs `next typegen`, then ESLint with `--max-warnings 0`, then `tsc --noEmit`, so a single warning fails it. CI's Lint check runs the same command.

`npm run format` fixes many ESLint and Prettier errors automatically. If a lint rule can't reasonably be satisfied, follow the `eslint-disable` guidance in docs/CONTRIBUTING.md: disable it for that one line and leave a comment saying why.

The repo has no automated tests. `npm run validate` does not build the app or run migrations. On every PR, the check-migrations workflow runs migrations against an empty database and checks the generated types are up to date. The preview workflow builds and deploys the app only for PRs opened from a branch in this repository; PRs from forks get no preview build.

## Guardrails

- Never push to or merge into `main`. A push to `main` deploys production and starts the jobs that update the production database.
- Never run migrations against a shared database, and never dispatch workflows (`migrate_database`, `seed_database`, `preview_manual` or any other). Preview deployments use the production database.
- Never commit `.env` files, API keys or other secrets.
- Don't edit `src/database/generatedDbTypes.d.ts` by hand. `npm run db:update-types` regenerates it from a migrated database.
- New migrations must also work with the code already on `main`, because production is migrated before the new code deploys. See the database migrations section of docs/CONTRIBUTING.md.

## Conventions

- Import with the `@/` alias, which maps to `src/`. ESLint rejects relative imports.
- Put code where docs/CODEBASE.md says it goes. Pages in `src/app` stay thin, and the UI lives in `src/components`.
- Use the wrappers in `src/components/ui` instead of importing `@radix-ui/*` directly.
- When you add a dependency, document it in docs/DEPENDENCIES.md. Import it in one wrapper module and block direct imports with `no-restricted-imports` in `eslint.config.mjs`, the same way `src/logic/toSlug.ts` wraps `slugify`.
- Write SQL in `sql` tagged templates with uppercase keywords. ESLint formats them.
- Experimental features go under `src/app/labs/<feature>/`, with a card on `src/app/labs/page.tsx`.

## Pull requests

Work on a branch, open a PR against `main` and fill in `.github/pull_request_template.md`. Link the issue with `Resolves #<number>`. Keep each PR to one change. Merging needs passing CI and an approval from a team member.
