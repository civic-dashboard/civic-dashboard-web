"use strict";

module.exports = {
  rules: {
    "require-classic-link": require("./lib/rules/require-classic-link")
  },
  configs: {
    recommended: {
      plugins: ["classic-link"],
      rules: {
        "classic-link/require-classic-link": "warn"
      }
    }
  }
};
