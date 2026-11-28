# Civic Dashboard Web App

This repository hosts the in-progress Civic Dashboard Web App! This page focuses on giving users an easy way to identify upcoming civic engagement opportunities in Toronto, and how they can take action on those opportunities. The currently deployed version can be found at [civicdashboard.ca](https://civicdashboard.ca).

## Quick links

Take a look at the following documentation files to get a better lay of the land, or skip to [Getting started](./README.md#getting-started) if you just want to clone the repo and start exploring!

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) gives a high-level overview of the tech stack.
- [CODEBASE.md](./docs/CODEBASE.md) lays out the file structure of the repository.
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) contains guidelines on making changes to the codebase.
- [DEPENDENCIES.md](./docs/DEPENDENCIES.md) explains what dependencies we use and why.
- [DATASOURCES.md](./docs/DATASOURCES.md) details which data sources we query from.
- [WIKI_MEDIA.md](./docs/WIKI_MEDIA.md) explains how to add images and video to wiki pages.

## Getting started (Manual)

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
cp .env.sample .env
```

### Initialize the database

```sh
npm run docker:start
npm run db:run-migrations
```

## Dev container

Use the Dev Container to get a ready-to-use development environment. You will need [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with Compose), [Visual Studio Code](https://code.visualstudio.com/), and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

### Open the project in the Dev Container

Clone the repository and open its folder in VS Code. When prompted, select **Reopen in Container** (or run **Dev Containers: Reopen in Container** from the Command Palette). The first launch builds the development container and automatically installs dependencies, loads environment variables from the root `.env.sample` through Compose (using the container's database URL), mounts that file as `.env` inside the container, runs database migrations and seeds, and generates the wiki pages. The host file remains named `.env.sample`. npm's download cache is persisted in a Docker volume across container rebuilds; `node_modules` is still installed cleanly from the lockfile.

## Add sample data to the database

This will download Agenda Item Considerations from the last month up until a month from now and save it into your local PostgreSQL

```sh
npm run tsxe src/scripts/updateDatabase.ts
```

This will download all available Votes and Councillors and save into your local database.

```sh
npm run tsxe src/scripts/repopulateRawContactsAndVotes.ts
```

## Wiki pages

Wiki pages are generated when the Dev Container is first created. After changing wiki content, run `npm run dev:html` to regenerate them.

See [docs/WIKI_MEDIA.md](./docs/WIKI_MEDIA.md) for adding images, video, and new wiki pages.

### Run the app

The development server starts automatically when the Dev Container is ready.

Try editing `src/app/page.tsx` to see your changes live! They should be visible on http://localhost:3000

### Emails

We use maildev to preview emails in development. After starting your docker containers, navigate to http://localhost:1080 in your browser. All emails that are sent from the app in development mode will show up in this inbox!

In the Dev Container, MailDev shares the app container's network namespace so the app's `localhost:1025` SMTP connection reaches it. The MailDev UI and SMTP ports are published through the app container.

Note that links in emails will by default link to https://civicdashboard.ca, rather than your local dev server. `HOSTNAME_FOR_EMAIL_LINKS` in your environment file is where you can change this.

Links in emails use `http://localhost:3000` in the Dev Container environment.
