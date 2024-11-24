import { AgendaItem } from '@/api/agendaItem';
import { Search } from 'lucide-react';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import FlexSearch from 'flexsearch';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from './ui/combobox';

type SearchOptions = {
  searchText: string;
  decisionBodyId?: string;
};

type SearchContext = {
  searchOptions: SearchOptions;
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
  searchResults: AgendaItem[];
};

const SearchContext = createContext<SearchContext | null>(null);

type Props = React.PropsWithChildren<{
  items: AgendaItem[];
}>;
export function SearchProvider({ children, items }: Props) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchText: '',
  });

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
    let filteredResults: AgendaItem[];
    if (searchOptions.searchText === '') {
      filteredResults = items;
    } else {
      filteredResults = [];
      const results = searchIndex.search(searchOptions.searchText, undefined, {
        enrich: true,
      });
      const existingKeys = new Set<string>();
      for (const fieldResult of results) {
        const filteredResult = fieldResult.result
          .map((r) => r.doc)
          .filter((d) => !existingKeys.has(d.id));
        filteredResults.push(...filteredResult);
        filteredResult.forEach((d) => existingKeys.add(d.id));
      }
    }

    if (searchOptions.decisionBodyId !== undefined) {
      filteredResults = filteredResults.filter(
        (item) =>
          item.decisionBodyId.toString() === searchOptions.decisionBodyId
      );
    }

    return filteredResults;
  }, [
    searchOptions.searchText,
    searchOptions.decisionBodyId,
    searchIndex,
    items,
  ]);

  return (
    <SearchContext.Provider
      value={{ searchOptions, setSearchOptions, searchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  return useContext(SearchContext)!;
};

type DecisionBodyFilterProps = {
  decisionBodies: Record<string, DecisionBody>;
};
export function DecisionBodyFilter({
  decisionBodies,
}: DecisionBodyFilterProps) {
  const {
    searchOptions: { decisionBodyId },
    setSearchOptions,
  } = useSearch();

  const options = useMemo(
    () =>
      Object.entries(decisionBodies).map(([id, { decisionBodyName }]) => ({
        id,
        label: decisionBodyName,
      })),
    [decisionBodies]
  );

  const onSelect = useCallback(
    (id: string) => {
      setSearchOptions((opts) => ({
        ...opts,
        decisionBodyId: id === opts.decisionBodyId ? undefined : id,
      }));
    },
    [setSearchOptions]
  );

  return (
    <Combobox
      options={options}
      currentId={decisionBodyId}
      onSelect={onSelect}
      placeholder="Select decision body..."
    />
  );
}

export function SearchBar() {
  const { setSearchOptions } = useSearch();

  return (
    <div className="flex flex-row space-x-2 items-center">
      <Search />
      <input
        className="p-1 flex-1"
        onChange={(ev) =>
          setSearchOptions((opts) => ({ ...opts, searchText: ev.target.value }))
        }
        placeholder="Search agenda items..."
      />
    </div>
  );
}
