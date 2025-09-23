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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import { PAGE_LIMIT, SEARCH_DEBOUNCE_DELAY_MS } from '@/constants/search';
import { TagEnum } from '@/constants/tags';

export type SearchContext = {
  searchOptions: SearchOptions;
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
  searchResults: AgendaItemSearchResponse | null;
  isLoadingMore: boolean;
  hasMoreSearchResults: boolean;
  getNextPage: () => void;
};

export const paramNames = {
  query: 'q',
  tags: 'tag',
  decisionBodyIds: 'body',
  minimumDate: 'minDate',
};

const SearchContext = createContext<SearchContext | null>(null);

/**
 * Converts the given search options into a URL query string for going from
 *  app state to URL.
 *
 * @param {SearchOptions} opts - Search options containing query parameters
 * such as text query, tags, decision body IDs, and minimum date.
 * @return {string} A URL-encoded query string derived from the
 * provided search options.
 */
export function toQueryString(opts: SearchOptions): string {
  const queryParams = new URLSearchParams();
  // if there is a query with text, update the query params
  if (opts.textQuery?.trim())
    queryParams.set(paramNames.query, opts.textQuery.trim());

  // for tags and decision bodies, we add them to the query as repeated params
  for (const t of opts.tags ?? []) queryParams.append(paramNames.tags, t);
  for (const id of opts.decisionBodyIds ?? [])
    queryParams.append(paramNames.decisionBodyIds, id.toString());

  // if there is a minimum date, add it to the query params, format
  //  as yyyy-mm-dd
  if (opts.minimumDate) {
    const date = new Date(opts.minimumDate);
    const yyyMmDd = date.toISOString().slice(0, 10);
    queryParams.set(paramNames.minimumDate, yyyMmDd);
  }
  return queryParams.toString();
}

/**
 * Parses a query string and extracts specific query parameters, used for going
 * from URL to app state.
 *
 * @param {string} queryString - The query string to be parsed.
 * @param {SearchOptions} defaults - Default values for the search options.
 * @return {Object} An object containing the parsed query parameters:
 *   - `textQuery`: The value of the 'q' query parameter, if present.
 *   - `tags`: An array of values for the 'tag' query parameter, if present.
 *   - `decisionBodyIds`: An array of numeric values for the 'body'
 *   query parameter.
 *   - `minimumDate`: The parsed date from the 'minDate' query parameter,
 *   if present; otherwise, undefined.
 */
export function fromQueryString(
  queryString: string,
  defaults: SearchOptions,
): SearchOptions {
  // fetch query params from the URL
  const queryParams = new URLSearchParams(queryString);
  const textQuery: string = queryParams.get(paramNames.query)?.trim() ?? ''; // never undefined
  const tags: TagEnum[] =
    (queryParams.getAll(paramNames.tags) as TagEnum[]) ?? defaults.tags;
  const decisionBodyIds: number[] = queryParams
    .getAll('body')
    .map(Number)
    .filter((n) => !Number.isNaN(n));

  const minDateStr: string | null = queryParams.get(paramNames.minimumDate);
  const minimumDate: Date | undefined = minDateStr
    ? new Date(minDateStr)
    : defaults.minimumDate;
  return {
    ...defaults,
    textQuery,
    tags,
    decisionBodyIds,
    minimumDate,
  };
}

type Props = React.PropsWithChildren;
export function SearchProvider({ children }: Props) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    textQuery: '',
    tags: [],
    decisionBodyIds: [],
    minimumDate: new Date(),
  });

  const [searchResults, setSearchResults] =
    useState<AgendaItemSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // needed for pagination / infinite scrolling
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(false);
  // use this ref to access latest searchResults val without adding searchResults to dependency arrays
  const searchResultsRef = useRef<AgendaItemSearchResponse | null>(null);

  // used to update the URL when the search options change
  const router = useRouter();
  const pathname = usePathname();
  const isReplacingRef = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isReplacingRef.current) {
      isReplacingRef.current = false;
      return;
    }

    const queryParams = searchParams.toString();
    setSearchOptions((prevState) => ({
      ...prevState,
      ...fromQueryString(queryParams, prevState),
    }));
  }, [searchParams]);

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
    // when searchOptions changes, that means we're executing a new search, so reset currentPage to 0
    setCurrentPage(0);
    const debounceTimeout = setTimeout(() => {
      // update the URL with the new search options
      const queryString = toQueryString(searchOptions);

      // to mark that the next URL change comes from us
      isReplacingRef.current = true;

      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, {
        scroll: false,
      });
      onSearch(searchOptions, 0);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    return () => clearTimeout(debounceTimeout);
  }, [searchOptions, onSearch, router, pathname]);

  // infinite scroll - trigger a new search when currentPage changes
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
