# Civic Dashboard Web App

This repository hosts the in-progress Civic Dashboard Web App! This page focuses on giving users an easy way to identify upcoming civic engagement opportunities in Toronto, and how they can take action on those opportunities. The currently deployed version can be found at [civicdashboard.ca](https://civicdashboard.ca).

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
npm install
```

### Initialize your environment files

```sh
cat >> .env  << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:54320/civic_dashboard
HOSTNAME_FOR_EMAIL_LINKS=http://localhost:3000
RESEND_API_KEY=not-needed-for-local-dev
EOF
```

### Initialize the database

```sh
npm run docker:start
npm run db:run-migrations
```

### Load a small amount of data to populate the database

This will download Agenda Item Considerations from the last month up until a month from now and save it into your local PostgreSQL

```sh
npm run tsxe src/scripts/updateDatabase.ts
```

This will download all available Votes and Councillors and save into your local database.

```sh
npm run tsxe src/scripts/repopulateRawContactsAndVotes.ts
```

### Run the app

```sh
npm run dev
```

Try editing `src/app/page.tsx` to see your changes live! They should be visible on http://localhost:3000

### Emails

We use maildev to preview emails in development. After starting your docker containers, navigate to http://localhost:1080 in your browser. All emails that are sent from the app in development mode will show up in this inbox!

Note that links in emails will by default link to https://civicdashboard.ca, rather than your local dev server. `HOSTNAME_FOR_EMAIL_LINKS`  in your environment file is where you can change this.
