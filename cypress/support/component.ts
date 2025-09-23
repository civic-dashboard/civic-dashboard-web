// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import { mount } from 'cypress/react'
import { createRouter } from 'next-router-mock';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Function to provide a mocked router
export const getMockRouter = (options?: any) => {
  const router = createRouter(options);
  const providerValue = {
    ...router,
    isReady: true,
  };
  return providerValue;
};

// Mount function that wraps your component in the context provider
export const mountWithRouter = (component: React.ReactNode, options?: any) => {
  const router = getMockRouter(options);
  return cy.mount(
    <AppRouterContext.Provider value={router}>
      {component}
    </AppRouterContext.Provider>
  );
};

Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)