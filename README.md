# Civic Dashboard Web App

This repository hosts the in-progress Civic Dashboard Web App! Currently, the landing page and actions page are here, and work is in progress to also bring the councillors page in as well. Eventually, we'd like to have a single web app providing the entire frontend and backend API experience for Civic Dashboard. This page focuses on giving users an easy way to identify upcoming civic engagement opportunities in Toronto, and how they can take action on those opportunities. The currently deployed version can be found at [civicdashboard.ca](https://civicdashboard.ca).

# Development

**Status**: Early development, but open to contributions! Please check in first before making any big PRs because the file structure is subject to change.

## Quick links

Take a look at the following documentation files to get a better lay of the land, or skip to [Getting started](./README.md#getting-started) if you just want to clone the repo and start exploring!

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) gives a high-level overview of the tech stack.
- [CODEBASE.md](./docs/CODEBASE.md) lays out the file structure of the repository.
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) contains guidelines on making changes to the codebase.
- [DEPENDENCIES.md](./docs/DEPENDENCIES.md) explains what dependencies we use and why.

## Getting started

To get started with local development, you'll need to take the following steps:

### Required tools

You will need the following installed on your system:

- nodejs: the version used in the project is listed in [.tool-versions](./.tool-versions), and can be managed using [asdf](https://asdf-vm.com/) version manager. Or follow [the official install guide](https://nodejs.org/en/download).
- Docker Compose: [installation docs](https://docs.docker.com/compose/install/).

### Clone the repo

```sh
git clone https://github.com/civic-dashboard/civic-dashboard-web
cd civic-dashboard-web
npm i
```

### Initialize your environment files

```sh
cat >> .env  << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:54320/civic_dashboard
HOSTNAME_FOR_EMAIL_LINKS=http://localhost:3000
RESEND_API_KEY=not-needed-for-local-dev
CRON_SECRET=not-needed-for-local-dev
EOF
```

### Initialize the database

```sh
npm run docker:start
npm run db:run-migrations
```

### Load a small amount of data to populate the database

This will download Agenda Items from the last month up until a month from now and save it into your local PostgreSQL

```sh
DATABASE_URL="postgresql://postgres:postgres@localhost:54320/civic_dashboard" npm run tsx src/scripts/updateDatabase.ts
```

### Run the app

```sh
npm run dev
```

Try editing `src/app/page.tsx` to see your changes live!
