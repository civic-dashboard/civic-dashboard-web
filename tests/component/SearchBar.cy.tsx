import React from 'react';
import { SearchBar } from '@/components/search';
import { SearchContext, SearchContextType } from '@/contexts/SearchContext';

describe('<SearchBar />', () => {
  it('renders', () => {
    const mockSearchContextValue: SearchContextType = {
      searchOptions: {
        textQuery: '',
        tags: [],
        decisionBodyIds: [],
        minimumDate: new Date(),
      },
      setSearchOptions: cy.stub().as('setSearchOptions'),
      searchResults: null,
      isLoadingMore: false,
      hasMoreSearchResults: false,
      getNextPage: cy.stub().as('getNextPage'),
    };
    // Mount the SearchBar wrapped in the context provider
    cy.mount(
      <SearchContext.Provider value={mockSearchContextValue}>
        <SearchBar />
      </SearchContext.Provider>,
    );
    cy.get('input').should('be.visible');
  });
});