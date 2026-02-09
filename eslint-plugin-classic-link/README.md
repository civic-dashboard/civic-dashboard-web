# eslint-plugin-classic-link

Local ESLint plugin: warns when a JSX `<a href="...">` does not include the CSS class `classic-link`.

Rule: `classic-link/require-classic-link` — warns when an anchor with `href` does not have `className` (or `class`) containing `classic-link`.

Enable locally in your project's `.eslintrc.json`:

```json
{
  "plugins": ["classic-link"],
  "rules": {
    "classic-link/require-classic-link": "warn"
  }
}
```

Notes:
- The rule statically checks string literals and template literals.
- It does not attempt to resolve runtime expressions (e.g. `clsx()`), to avoid false positives.
