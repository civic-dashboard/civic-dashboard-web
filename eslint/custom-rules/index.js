'use strict';

module.exports = {
  rules: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'require-classic-link': require('./lib/rules/require-classic-link'),
  },
  configs: {
    recommended: {
      plugins: ['classic-link'],
      rules: {
        'custom-rules/require-classic-link': 'warn',
      },
    },
  },
};
