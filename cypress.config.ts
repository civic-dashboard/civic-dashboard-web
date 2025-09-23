export default {
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: 'tests/**/*.{cy.ts,cy.tsx}'
  },

  e2e: {
    specPattern: 'tests/e2e/**.ts',
  },
};
