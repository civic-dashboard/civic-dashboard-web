import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import { TagEnum } from '@/constants/tags';

// TODO: these are both O(n^2) which is silly, but Set isn't available on the server yet
const areArraysIdenticalAsSets = (a: unknown[], b: unknown[]) => {
  return a.length === b.length && a.every((elem) => b.includes(elem));
};

export const sortedDeduplicatedArray = <T>(arr: T[]): T[] => {
  const deduped: T[] = [];
  for (const elem of arr.sort()) {
    if (!deduped.includes(elem)) {
      deduped.push(elem);
    }
  }
  return deduped;
};

export const areSearchFiltersEmpty = (filters: SubscribableSearchFilters) => {
  if (filters.textQuery.length > 0) return false;
  if (filters.tags.length > 0) return false;
  if (filters.decisionBodyIds.length > 0) return false;
  return true;
};

export const areSearchFiltersIdentical = (
  a: SubscribableSearchFilters,
  b: SubscribableSearchFilters,
) => {
  if (a.textQuery != b.textQuery) return false;
  if (!areArraysIdenticalAsSets(a.tags, b.tags)) {
    return false;
  }
  if (!areArraysIdenticalAsSets(a.decisionBodyIds, b.decisionBodyIds)) {
    return false;
  }
  return true;
};

export type SubscribableSearchFilters = {
  textQuery: string;
  decisionBodyIds: number[];
  tags: TagEnum[];
};

export type TransientSearchFilters = {
  termId?: number;
  minimumDate?: Date;
  maximumDate?: Date;
};

export type SearchFilters = SubscribableSearchFilters & TransientSearchFilters;

export const sortLabels = ['Oldest', 'Newest', "Most Relevant", "Least Relevant"] as const;
export type SortLabel = (typeof sortLabels)[number];
export const sortByOptions = ['date', 'relevance'] as const;
export type SortByOption = (typeof sortByOptions)[number];
export const sortDirectionOptions = ['ascending', 'descending'] as const;
export type SortDirectionOption = (typeof sortDirectionOptions)[number];

export type SearchSort = {
  sortId: number;
  sortLabel: SortLabel;
  sortBy: SortByOption;
  sortDirection: SortDirectionOption;
};

export type SearchOptions = SearchFilters & SearchSort;

export type SearchPagination = {
  page: number;
  pageSize: number;
};

export type FetchSearchArgs = {
  options: SearchOptions;
  pagination: SearchPagination;
  abortSignal?: AbortSignal;
};
export const fetchSearchResults = async ({
  options,
  pagination,
  abortSignal,
}: FetchSearchArgs) => {
  const searchParams = new URLSearchParams();
  if (options.textQuery) {
    searchParams.set('textQuery', options.textQuery);
  }
  if (options.decisionBodyIds.length > 0) {
    searchParams.set('decisionBodyIds', options.decisionBodyIds.join(','));
  }
  if (options.tags.length > 0) {
    searchParams.set('tags', options.tags.join(','));
  }
  searchParams.set('page', pagination.page.toString());
  searchParams.set('pageSize', pagination.pageSize.toString());
  const sortBy =
    options.sortBy ??
    (options.textQuery || options.tags.length > 0 ? 'relevance' : 'date');
  searchParams.set('sortBy', sortBy);
  searchParams.set(
    'sortDirection',
    options.sortDirection ??
      (sortBy === 'relevance' || options.minimumDate === undefined
        ? 'descending'
        : 'ascending'),
  );
  if (options.minimumDate) {
    searchParams.set('minimumDate', options.minimumDate?.getTime().toString());
  }
  if (options.maximumDate) {
    searchParams.set('maximumDate', options.maximumDate?.getTime().toString());
  }
  const response = await fetch(`/api/agenda-item/search?${searchParams}`, {
    signal: abortSignal,
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(`Failed to fetch search results: ${error?.message}`);
    } catch {
      throw new Error(`Failed to fetch search results`);
    }
  }

  return (await response.json()) as AgendaItemSearchResponse;
};
