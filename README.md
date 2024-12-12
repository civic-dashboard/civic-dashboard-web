# Civic Dashboard Actions Page

This repository hosts the in-progress Civic Dashboard Actions Page! This page focuses on giving users an easy way to identify upcoming civic engagement opportunities in Toronto, and how they can take action on those opportunities. The currently deployed version can be found at [actions.civicdashboard.ca](https://actions.civicdashboard.ca).

# Development

At a high level, this is a Next.js app deployed to Cloudflare workers.

## Getting started

To get started with local development, you can clone the repo and run the development server:

```sh
git clone https://github.com/Citizen-Dashboard/actions
cd actions
npm i
npm run dev
```

Try editing `src/page.tsx` to see your changes live! Then feel free to surf around if you like exploring that way, or check out the following documentation for a guided tour.

## Understanding the codebase

Take a look at the following documentation files to get a better lay of the land.

- [ARCHITECTURE.md](./ARCHITECTURE.md) gives a high-level overview of the tech stack.
- [CODEBASE.md](./CODEBASE.md) lays out the file structure of the repository.
- [CONTRIBUTING.md](./CONTRIBUTING.MD) contains guidelines on making changes to the codebase.
- [DEPENDENCIES.md](./DEPENDENCIES.md) explains what dependencies we use and why.

## Emails

Emails currently don't have a good local development story. If you need to develop email-related features, you'll have to ask for a prod API key and make sure you only put your own email address into the app 😬. Would love to have a better story here if someone wants to step in and help!
