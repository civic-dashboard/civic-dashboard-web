import React from 'react'
import { SearchBar } from '@/components/search'
import { SearchContext } from '@/contexts/SearchContext';

describe('<SearchBar />', () => {
  it('renders', () => {
    const mockSearchContextValue = {
      setSearchOptions: cy.spy().as('setSearchOptions'), // Use a spy to test if the function is called
      searchOptions: { query: '', filters: {} }, // Provide a default state
    };

    // Mount the SearchBar wrapped in the context provider
    cy.mount(
      <SearchContext.Provider value={mockSearchContextValue}>
        <SearchBar />
      </SearchContext.Provider>
    );
    cy.get('input').should('be.visible');
  });
});