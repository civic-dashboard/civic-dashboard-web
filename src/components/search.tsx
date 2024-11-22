import { AgendaItem } from '@/api/agendaItem';
import { Search } from 'lucide-react';
import React, { createContext, useContext, useMemo, useState } from 'react';
import FlexSearch from 'flexsearch';

type SearchContext = {
  searchText: string;
  setSearchText: (search: string) => void;
  searchResults: AgendaItem[];
};

const SearchContext = createContext<SearchContext | null>(null);

type Props = React.PropsWithChildren<{
  items: AgendaItem[];
}>;
export function SearchProvider({ children, items }: Props) {
  const [searchText, setSearchText] = useState('');

  const searchIndex = useMemo(() => {
    const searchIndex = new FlexSearch.Document<AgendaItem, true>({
      tokenize: 'forward',
      document: {
        id: 'id',
        index: ['agendaItemTitle', 'decisionBodyName', 'agendaItemSummary'],
        store: true,
      },
    });

    for (const item of items) {
      searchIndex.add(item);
    }

    return searchIndex;
  }, [items]);

  const searchResults = useMemo(() => {
    if (searchText === '') {
      return items;
    }
    const results = searchIndex.search(searchText, undefined, { enrich: true });
    const filteredResults = [];
    const existingKeys = new Set<string>();
    for (const fieldResult of results) {
      const filteredResult = fieldResult.result
        .map((r) => r.doc)
        .filter((d) => !existingKeys.has(d.id));
      filteredResults.push(...filteredResult);
      filteredResult.forEach((d) => existingKeys.add(d.id));
    }
    return filteredResults;
  }, [searchIndex, searchText, items]);
  return (
    <SearchContext.Provider
      value={{ searchText, setSearchText, searchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  return useContext(SearchContext)!;
};

export function SearchBar() {
  const { setSearchText } = useSearch();

  return (
    <div className="flex flex-row space-x-2 items-center">
      <Search />
      <input
        className="p-1 flex-1"
        onChange={(ev) => setSearchText(ev.target.value)}
        placeholder="Search agenda items..."
      />
    </div>
  );
}
