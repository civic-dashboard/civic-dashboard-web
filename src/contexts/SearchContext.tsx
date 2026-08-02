import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { fetchSearchResults, SearchOptions } from '@/logic/search';
import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_DELAY_MS } from '@/constants/search';

import { getStartOfToday } from '@/logic/date';

type TimeRangeType = 'upcoming' | 'past';

type SearchContext = {
  searchOptions: SearchOptions;
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
  searchResults: AgendaItemSearchResponse | null;
  isLoadingMore: boolean;
  hasMoreSearchResults: boolean;
  getNextPage: () => void;
  timeRange: TimeRangeType;
  setTimeRange: (timeRange: TimeRangeType) => void;
};

const SearchContext = createContext<SearchContext | null>(null);

type Props = React.PropsWithChildren;
export function SearchProvider({ children }: Props) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(() => {
    const startOfToday = getStartOfToday();

    return {
      textQuery: '',
      tags: [],
      decisionBodyIds: [],
      minimumDate: startOfToday,
    };
  });

  const [searchResults, setSearchResults] =
    useState<AgendaItemSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // needed for pagination / infinite scrolling
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false);
  // use this ref to access latest searchResults val without adding searchResults to dependency arrays
  const searchResultsRef = useRef<AgendaItemSearchResponse | null>(null);

  // Controlling time range of action items fetched (moved from UpcomingPastToggle)
  const [timeRange, setTimeRange] = useState<TimeRangeType>('upcoming');

  // Setting search options based on time range (moved from UpcomingPastToggle)
  useEffect(() => {
    const isPast = timeRange === 'past';
    const startOfToday = getStartOfToday();

    setSearchOptions((opts) => ({
      ...opts,
      minimumDate: isPast ? undefined : startOfToday,
      maximumDate: isPast ? new Date(startOfToday.getTime() - 1) : undefined,
    }));
  }, [timeRange]);

  // keep the ref in sync with the actual state
  useEffect(() => {
    searchResultsRef.current = searchResults;
  }, [searchResults]);

  const getNextPage = useCallback(() => {
    if (!isLoading && hasMoreSearchResults) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoading, hasMoreSearchResults]);

  const controllerRef = useRef<AbortController | null>(null); // Used to cancel previous requests

  const onSearch = useCallback(async (options: SearchOptions, page: number) => {
    setIsLoading(true);
    const isNewSearch = page === 0;

    // If a previous request is still pending, abort it
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create a new AbortController instance for the current request
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetchSearchResults({
        options,
        pagination: { page: page, pageSize: PAGE_LIMIT },
        abortSignal: controller.signal,
      });

      // use the current ref value, instead of adding searchResults to the useCallback dependency array (infinite loop)
      const currentResults = searchResultsRef.current;

      if (isNewSearch) {
        setSearchResults(response);
      } else if (currentResults) {
        setSearchResults({
          ...response,
          // append new results we just got to our prev results, as we're keeping all results in the DOM
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
    const debounceTimeout = setTimeout(() => {
      // when searchOptions changes, that means we're executing a new search, so reset currentPage to 0
      setCurrentPage(0);

      onSearch(searchOptions, 0);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    return () => clearTimeout(debounceTimeout);
  }, [searchOptions, onSearch]);

  // infinite scroll - trigger a new search when currentPage changes
  useEffect(() => {
    if (currentPage > 0) {
      // onSearch is async; setIsLoading(true) is intentional and doesn't cause a cascade
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        timeRange,
        setTimeRange,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  return useContext(SearchContext)!;
};
