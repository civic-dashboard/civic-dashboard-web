# Contributing

This is (probably not, but hopefully!) all the information you need to contribute to the project as a developer.

## Getting started with our tech stack

🚧 There obviously won't be room to do a comprehensive tutorial on Next, TypeScript, JavaScript, React, all of web dev, etc... but it'd be nice to have a brief explanation and some helpful links here. Please ask around if that would be useful until then! 🚧

## Pull request and commit workflow

- Commits to `main` trigger a new production deployment (a bit scary!)
- Commits to `main` _require_ a PR
- PRs can only be merged if all the CI checks pass. that includes:
  - a linter, to make sure our code style is consistent
  - a preview deployment!

### Preview deployments

- all PRs will generate a preview deployment, which is a live deployment of the app in the production environment with your code changes in the PR, only accessible via an obfuscated URL.
- this is a very handy way to be able to check that your changes are working as expected before merging.
- any behavior you see in the preview deployment should (i say should because when does software _always_ do what you want it to) be identical once you merge to `main`
- note that preview deployments run against the production database since we currently have no staging database!! see (Migrations)[#migrations] for more info

### Code review

- PRs do _not_ currently require a review.
  - because we're super async we don't want to hold up changes based on people's availability for a review
  - please use your best judgement re: whether it would be good to have a second pair of eyes on your code
  - some rules of thumb:
    - if you're nervous about merging, request a review!
    - if it's your first PR, request a review!
    - if you're not sure the right way to write some code, request a review!

### Migrations

- there are currently no workflows which automatically run database migrations
- if you're merging a pull request with a migration to `main` (which will deploy the web app to prod), you should manually run the migration and ensure it succeeds _before_ merging the PR.
- You can run the migrations on your PR by dispatching (the `migrate_database` workflow)[https://github.com/civic-dashboard/civic-dashboard-web/actions/workflows/migrate_database.yml] from your branch (or asking someone who has the appropriate permissions to do so).
- since preview deployments currently run against the production database, you can use that PR's preview deployment to validate changes before merging the code

## Dependencies

- we try to avoid re-inventing the wheel, so please don't be scared to add dependencies to the project!
- but we do also want to take care and be aware of what we're signing ourselves up for with our dependencies. to that end, we:
  - document their purpose in (DEPENDENCIES.md)[./DEPENDENCIES.md]
  - try to import them in as few places as possible, by creating wrapper functions and using the `no-restricted-imports` eslint rule
    - this allows us flexibility to adjust the API of the dependency, and makes it easy to swap it out or remove it if necessary
    - see (`toSlug.ts`)[https://github.com/civic-dashboard/civic-dashboard-web/tree/main/src/logic/toSlug.ts] and (`.eslintrc.json`)[https://github.com/civic-dashboard/civic-dashboard-web/tree/main/.eslintrc.json#L14] for an example of this.

## Emails

Right now the email functionality doesn't have a good local development story. I just use the prod API key and try to make sure only my email gets into my local system 😬. Would love some help here!
Brief research suggests a combination of [maildev](https://github.com/maildev/maildev?tab=readme-ov-file) and [nodemailer](https://github.com/nodemailer/nodemailer) could do the trick.
