import { Search } from 'lucide-react';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { fetchSearchResults, SearchOptions, tags } from '@/logic/search';
import { Input } from '@/components/ui/input';
import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';

const SEARCH_DEBOUNCE_DELAY_MS = 250;

type SearchContext = {
  searchOptions: SearchOptions;
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
  searchResults: AgendaItemSearchResponse | 'loading';
};

const SearchContext = createContext<SearchContext | null>(null);

type Props = React.PropsWithChildren;
export function SearchProvider({ children }: Props) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    tags: [],
    minimumDate: new Date(),
  });

  const [searchResults, setSearchResults] = useState<
    AgendaItemSearchResponse | 'loading'
  >('loading');
  const controllerRef = useRef<AbortController | null>(null); // Used to cancel previous requests

  const onSearch = useCallback(async (options: SearchOptions) => {
    // If a previous request is still pending, abort it
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create a new AbortController instance for the current request
    const controller = new AbortController();
    controllerRef.current = controller;

    setSearchResults('loading');

    try {
      setSearchResults(
        await fetchSearchResults({
          options,
          pagination: { page: 0, pageSize: 50 },
          abortSignal: controller.signal,
        }),
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          console.error(error.message);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchOptions);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    return () => clearTimeout(debounceTimeout);
  }, [searchOptions, onSearch]);

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
    [decisionBodies],
  );

  const onSelect = useCallback(
    (id: string) => {
      setSearchOptions((opts) => ({
        ...opts,
        decisionBodyId: id === opts.decisionBodyId ? undefined : id,
      }));
    },
    [setSearchOptions],
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

function Tag({ tag }: { tag: string }) {
  const { searchOptions, setSearchOptions } = useSearch();
  const isSelected = useMemo(
    () => searchOptions.tags.includes(tag),
    [searchOptions.tags, tag],
  );

  const onClick = useCallback(() => {
    setSearchOptions((opts) => {
      const newTags = opts.tags.includes(tag)
        ? opts.tags.filter((t) => t !== tag)
        : [...opts.tags, tag];

      return { ...opts, tags: newTags };
    });
  }, [tag, setSearchOptions]);

  return (
    <Badge variant={isSelected ? 'default' : 'secondary'} onClick={onClick}>
      {tag}
    </Badge>
  );
}
export function Tags() {
  return (
    <div className="flex flex-row flex-wrap space-x-2 space-y-2 items-end justify-center max-w-[600px]">
      {Object.keys(tags).map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
}

export function SearchBar() {
  const { setSearchOptions } = useSearch();

  return (
    <div className="flex flex-row space-x-2 items-center flex-1 max-w-[500px]">
      <Search />
      <Input
        className="py-1 px-2"
        onChange={(ev) =>
          setSearchOptions((opts) => ({ ...opts, query: ev.target.value }))
        }
        placeholder="Search agenda items..."
      />
    </div>
  );
}
