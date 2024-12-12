# Contributing

This is (probably not, but hopefully!) all the information you need to contribute to the project as a developer.

## Getting started with our tech stack

🚧 There obviously won't be room to do a comprehensive tutorial on Next, TypeScript, JavaScript, React, all of web dev, etc... but it'd be nice to have a brief explanation and some helpful links here. 🚧

## How GitHub is set up

Right now, the GitHub repo is set up with the following features:

- Commits to `main` trigger a new production deployment (a bit scary!)
- Commits to `main` _require_ a PR
- PRs can only be merged if all the CI checks pass. that includes:
  - a linter, to make sure our code style is consistent
  - a preview deployment!
    - all PRs will generate a preview deployment, which is a live deployment of the app in the production environment with your code changes in the PR, only accessible via an obfuscated URL.
    - this is a very handy way to be able to check that your changes are working as expected before merging.
    - any behavior you see in the preview deployment should (i say should because when does software _always_ do what you want it to) be identical once you merge to `main`
- PRs do _not_ currently require a review.
  - because we're super async we don't want to hold up changes based on people's availability for a review
  - please use your best judgement re: whether it would be good to have a second pair of eyes on your code
  - some rules of thumb:
    - if you're nervous about merging, request a review!
    - if it's your first PR, request a review!
    - if you're not sure the right way to write some code, request a review!

## Emails

Right now the email functionality doesn't have a good local development story. I just use the prod API key and try to make sure only my email gets into my local system 😬. Would love some help here!
Brief research suggests a combination of [maildev](https://github.com/maildev/maildev?tab=readme-ov-file) and [nodemailer](https://github.com/nodemailer/nodemailer) could do the trick.
