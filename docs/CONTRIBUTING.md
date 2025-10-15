# Contributing

This is (probably not, but hopefully!) all the information you need to contribute to the project as a developer.

## Getting started with our tech stack

🚧 There obviously won't be room to do a comprehensive tutorial on Next, TypeScript, JavaScript, React, all of web dev, etc... but it'd be nice to have a brief explanation and some helpful links here. Please ask around if that would be useful until then! 🚧

## Github Issues and Github Project

We use [Github Issues](https://github.com/civic-dashboard/civic-dashboard-web/issues) and have a [Project Board](https://github.com/orgs/civic-dashboard/projects/3) to help us manage everything that needs to be done. You can pick an issue and assign yourself to it or even create new issues! 

We've documented how we use Github for project management in this [Google Doc](https://docs.google.com/document/d/1xehRm-2yZvC_9VRm5CrhbzlIyVNDNh3cpTQPDdtLRso/edit?tab=t.46j0b7xt6q03)


## Pull request and commit workflow

- Commits to `main` trigger a new production deployment (a bit scary!)
- Commits to `main` _require_ a PR
- PRs can only be merged if all the CI checks pass. that includes:
  - a linter, to make sure our code style is consistent
  - a preview deployment that executes and deploy successfully!

### Code review

- PRs currently require a review from 1 team member.
  - If you're not sure who should be doing a review, post on Slack within `#tech-civic-dashboard`

### Permissions

- any org member can create branches and open PRs which will run the CI workflows, but they will not be able to merge to `main`.
- members of the "eng" (engineering) team and "write" team are able to merge to `main`
- If someone is not currently part of the org, they can open a PR from a fork. However it will not automatically run the preview deployment CI because the fork does not have access to org secrets. Someone from the "eng" or "write" team can manually trigger the `Upload preview deployment manual` Github Actions after reviewing what the PR does

### Preview deployments

- all PRs will generate a preview deployment, which is a live deployment of the app in the production environment with your code changes in the PR, only accessible via an obfuscated URL.
- this is a very handy way to be able to check that your changes are working as expected before merging.
- any behavior you see in the preview deployment should (i say should because when does software _always_ do what you want it to) be identical once you merge to `main`
- note that preview deployments run against the production database since we currently have no staging database!! see [Migrations](#migrations) for more info

### Migrations

- there are currently no workflows which automatically run database migrations
- if you're merging a pull request with a migration to `main` (which will deploy the web app to prod), you should manually run the migration and ensure it succeeds _before_ merging the PR.
- You can run the migrations on your PR by dispatching [the `migrate_database` workflow](https://github.com/civic-dashboard/civic-dashboard-web/actions/workflows/migrate_database.yml) from your branch (or asking someone who has the appropriate permissions to do so).
- since preview deployments currently run against the production database, you can use that PR's preview deployment to validate changes before merging the code

## Dependencies

- we try to avoid re-inventing the wheel, so please don't be scared to add dependencies to the project!
- but we do also want to take care and be aware of what we're signing ourselves up for with our dependencies. to that end, we:
  - document their purpose in [DEPENDENCIES.md](./DEPENDENCIES.md)
  - try to import them in as few places as possible, by creating wrapper functions and using the `no-restricted-imports` eslint rule
    - this allows us flexibility to adjust the API of the dependency, and makes it easy to swap it out or remove it if necessary
    - see [`toSlug.ts`](https://github.com/civic-dashboard/civic-dashboard-web/tree/main/src/logic/toSlug.ts) and [`.eslintrc.json`](https://github.com/civic-dashboard/civic-dashboard-web/tree/main/.eslintrc.json#L14) for an example of this.

## Teams
As soon as you have been onboarded and feel comfortable with submitting your first PR, you can ask to join the `write` Github team. This team has the Github Write access which will allow you to merge PRs, see the execution of our Github actions, etc. If you have been on the project for a few months, you can join the `eng` team which has the Github Maintain access. Read the official [Github docs on Repository Roles
](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization) for more info
