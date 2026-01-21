# Contributing

This is (probably not, but hopefully!) all the information you need to contribute to the project as a developer.

## Getting started with our tech stack

🚧 There obviously won't be room to do a comprehensive tutorial on Next, TypeScript, JavaScript, React, all of web dev, etc... but it'd be nice to have a brief explanation and some helpful links here. Please ask around if that would be useful until then! 🚧

## Github Issues and Github Project

We use [Github Issues](https://github.com/civic-dashboard/civic-dashboard-web/issues) and have a [Project Board](https://github.com/orgs/civic-dashboard/projects/3) to help us manage everything that needs to be done. You can pick an issue and assign yourself to it or even create new issues!

We've documented how we use Github for project management in this [Google Doc](https://docs.google.com/document/d/1xehRm-2yZvC_9VRm5CrhbzlIyVNDNh3cpTQPDdtLRso/edit?tab=t.46j0b7xt6q03)

## Pull request (PR) and commit workflow

- Commits to `main` trigger a new production deployment (a bit scary!)
- Commits to `main` _require_ a PR
- PRs can only be merged if all the CI checks pass and have at least one approval from a team member. The CI checks are:
  - a [linter](#linting), to make sure our code style is consistent.
  - a [preview deployment](#preview-deployments) that ensures the build works and allows you to test your changes!
  - a [database migration](#database-migrations) checker which ensures that migrations run successfully.

### Code review

- PRs currently require a review from 1 team member.
  - If you're not sure who to request a review from, post on Slack within `#tech-civic-dashboard`

### Permissions

- any org member can create branches and open PRs which will run the CI workflows, but they will not be able to merge to `main`.
- members of the "eng" (engineering) team and "write" team are able to merge to `main`
- If someone is not currently part of the org, they can open a PR from a fork. However it will not automatically run the preview deployment CI because the fork does not have access to org secrets. Someone from the "eng" or "write" team can manually trigger the `Upload preview deployment manual` Github Actions after reviewing what the PR does

### Linting

- We run a linter on all of our PRs. This is a tool which automatically detects issues in our code that could cause inconsistency, incorrectness, or confusion.
- The linter is very strict, and fails even on warnings. This is to avoid a situation where we accrue a lot of code which causes warnings, and the warnings become difficult or impossible to understand because there are so many.
- You can run `npm run lint` on your local machine to check whether there are any issues, or make sure you've fixed them before pushing another commit to your PR.
- You can try running `npm run format` if the lint check complains at you and if you're lucky it'll get fixed automatically!
- If you're having trouble with a lint error that is difficult to fix, the following remedies are available:
  - ask for help! There should always be a friendly face to help sort it out.
  - disable the check for your code. If you put a comment on the line of code before where the lint error occurs, with the content `// eslint-disable-next-line name-of-failing-lint-here`, then the linter will magically stop complaining!
    - If you do this, you should document why we're unable to get the check to run. If it's something that we could get running but it will just take more time and gumption than is worth right now, file a follow-up issue to address it and link to the issue in your comment.
    - In some cases, you may stumble on a lint check that you don't think should be enabled for the whole project. You can enable, disable, and modify the behaviour of lint checks using our `.eslintrc.json`, but consider checking in with the team before doing so and documenting why you made that decision!

### Preview deployments

- All PRs will generate a preview deployment, which is a live deployment of the app in the production environment with your code changes in the PR, only accessible via an obfuscated URL.
- This is a very handy way to be able to check that your changes are working as expected before merging.
- Any behavior you see in the preview deployment should (i say should because when does software _always_ do what you want it to) be identical once you merge to `main`.
- Note that preview deployments run against the production database since we currently have no staging database!! see [Migrations](#migrations) for more info.

### Database migrations

- There is a CI check which ensures that the migrations run successfully against an empty database, and that source code which is generated from the contents of the database is up to date.
- There are currently no workflows which automatically run database migrations against production.
- If you're merging a pull request with a migration to `main` (which will deploy the web app to prod), you should manually run the migration and ensure it succeeds _before_ merging the PR.
- You can run the migrations on your PR by dispatching [the `migrate_database` workflow](https://github.com/civic-dashboard/civic-dashboard-web/actions/workflows/migrate_database.yml) from your branch (or asking someone who has the appropriate permissions to do so).
- Since preview deployments currently run against the production database, you can use that PR's preview deployment to validate changes before merging the code.
- Since you will be migrating the production database _before_ deploying the code which accesses the new database, your DB changes should be compatible with the backend code which exists on the main branch as well as your PR.
- If it would be onerous to meet this requirement (sometimes it means you'd have to do a bunch of extra work and split your change into multiple PRs), we're still at a stage of growth where it's acceptable to run the migrations knowing they will cause some breakage on production if:
  - you are available to quickly merge your PR once you've validated that everything is working as expected.
  - you are available to quickly roll back your migration if everything is not working as expected.
  - you understand how to execute all of the above steps prior to running the migration against production.

## Dependencies

- We try to avoid re-inventing the wheel, so please don't be scared to add dependencies to the project!
- but we do also want to take care and be aware of what we're signing ourselves up for with our dependencies. to that end, we:
  - document their purpose in [DEPENDENCIES.md](./DEPENDENCIES.md).
  - try to import them in as few places as possible, by creating wrapper functions and using the `no-restricted-imports` eslint rule:
    - this allows us flexibility to adjust the API of the dependency, and makes it easy to swap it out or remove it if necessary.
    - see [`toSlug.ts`](https://github.com/civic-dashboard/civic-dashboard-web/tree/main/src/logic/toSlug.ts) and [`.eslintrc.json`](https://github.com/civic-dashboard/civic-dashboard-web/tree/main/.eslintrc.json#L14) for an example of this.

## Teams

As soon as you have been onboarded and feel comfortable with submitting your first PR, you can ask to join the `write` Github team. This team has the Github Write access which will allow you to merge PRs, see the execution of our Github actions, etc. If you have been on the project for a few months, you can join the `eng` team which has the Github Maintain access. Read the official [Github docs on Repository Roles
](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization) for more info.
