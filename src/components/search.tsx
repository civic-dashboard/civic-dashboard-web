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
import { fetchSearchResults, SearchOptions } from '@/logic/search';
import { Input } from '@/components/ui/input';
import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import { allTags, Tag, TagEnum } from '@/constants/tags';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_DELAY_MS } from '@/constants/search';

type SearchContext = {
  searchOptions: SearchOptions;
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
  searchResults: AgendaItemSearchResponse | null;
  isLoadingMore: boolean;
  hasMoreSearchResults: boolean;
  getNextPage: () => void;
};

const SearchContext = createContext<SearchContext | null>(null);

type Props = React.PropsWithChildren;
export function SearchProvider({ children }: Props) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    tags: [],
    minimumDate: new Date(),
  });

  const [searchResults, setSearchResults] =
    useState<AgendaItemSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // infinite scrolling
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false);

  // use ref to access latest searchResults val without adding searchResults to dependency arrays
  const searchResultsRef = useRef<AgendaItemSearchResponse | null>(null);

  // keep the ref up to date with the actual state
  useEffect(() => {
    searchResultsRef.current = searchResults;
  }, [searchResults]);

  useEffect(() => {
    console.log('SearchProvider render, currentPage:', currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log('SearchProvider render, isLoading:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('SearchProvider render, hasMoreResults:', hasMoreSearchResults);
  }, [hasMoreSearchResults]);

  const getNextPage = useCallback(() => {
    console.log('getNextPage called');
    if (!isLoading && hasMoreSearchResults) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoading, hasMoreSearchResults]);

  const controllerRef = useRef<AbortController | null>(null); // Used to cancel previous requests

  const onSearch = useCallback(async (options: SearchOptions, page: number) => {
    console.log('onSearch triggered');
    // for new searches (page 0), reset results
    const isNewSearch = page === 0;

    // If a previous request is still pending, abort it
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create a new AbortController instance for the current request
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);

    try {
      const response = await fetchSearchResults({
        options,
        pagination: { page: page, pageSize: PAGE_LIMIT },
        abortSignal: controller.signal,
      });

      // Use the current ref value instead of the dependency
      const currentResults = searchResultsRef.current;

      if (isNewSearch) {
        setSearchResults(response);
      } else if (currentResults) {
        setSearchResults({
          ...response,
          results: [...currentResults.results, ...response.results],
        });
      } else {
        setSearchResults(response);
      }
      const lastItemCount = (response.page + 1) * response.pageSize;
      setHasMoreSearchResults(lastItemCount < response.totalCount);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          console.error(error.message);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // when searchOptions changes, that means we're executing a new search, so reset currentPage to 0
    setCurrentPage(0);

    const debounceTimeout = setTimeout(() => {
      onSearch(searchOptions, 0);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    return () => clearTimeout(debounceTimeout);
  }, [searchOptions, onSearch]);

  // infinite scroll
  useEffect(() => {
    if (currentPage > 0) {
      onSearch(searchOptions, currentPage);
    }
  }, [currentPage, searchOptions, onSearch]);

  return (
    <SearchContext.Provider
      value={{
        searchOptions,
        setSearchOptions,
        searchResults,
        isLoadingMore: isLoading && searchResults !== null,
        hasMoreSearchResults,
        getNextPage,
      }}
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

function TagToggle({ tagKey, tag }: { tagKey: TagEnum; tag: Tag }) {
  const { searchOptions, setSearchOptions } = useSearch();
  const isSelected = useMemo(
    () => searchOptions.tags.includes(tagKey),
    [searchOptions.tags, tagKey],
  );

  const onClick = useCallback(() => {
    setSearchOptions((opts) => {
      const newTags = opts.tags.includes(tagKey)
        ? opts.tags.filter((t) => t !== tagKey)
        : [...opts.tags, tagKey];

      return { ...opts, tags: newTags };
    });
  }, [tagKey, setSearchOptions]);

  return (
    <Badge
      variant={isSelected ? 'default' : 'secondary'}
      onClick={onClick}
      title={tag.searchQuery}
    >
      {tag.displayName}
    </Badge>
  );
}
export function Tags() {
  return (
    <div className="flex flex-row flex-wrap space-x-2 space-y-2 items-end justify-center max-w-[600px]">
      {Object.entries(allTags).map(([key, tag]) => (
        <TagToggle key={key} tagKey={key as TagEnum} tag={tag} />
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

export function ShowFullHistory() {
  const { searchOptions, setSearchOptions } = useSearch();
  const onCheckedChange = useCallback(
    (checked: CheckedState) => {
      setSearchOptions((opts) => ({
        ...opts,
        minimumDate: checked === true ? undefined : new Date(),
      }));
    },
    [setSearchOptions],
  );

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={searchOptions.minimumDate === undefined}
        onCheckedChange={onCheckedChange}
        id="full-history"
      />
      <label
        htmlFor="full-history"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show full history
      </label>
    </div>
  );
}
