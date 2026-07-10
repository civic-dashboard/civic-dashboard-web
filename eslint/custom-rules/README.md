# eslint-plugin-custom-rules

ESLint plugin that is local to this project and implements custom ESLint rules for the Civic Dashboard site.

## Rules

### `classic-link/require-classic-link`

Warns when an anchor with `href` is missing the CSS class `classic-link`. Links in articles should be styled with this class. In contexts where the link should be styled differently (e.g. if it's styled as a button), use an inline disable to ignore this rule.
