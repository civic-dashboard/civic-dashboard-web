import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import { TagEnum } from '@/constants/tags';
import type {
  SortByOption,
  SortDirectionOption,
} from '@/database/queries/agendaItems';

const areArraysIdenticalAsSets = (a: unknown[], b: unknown[]) => {
  return new Set(a).symmetricDifference(new Set(b)).size === 0;
};

export const areCoreSearchOptionsIdentical = (
  a: CoreSearchOptions,
  b: CoreSearchOptions,
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

export type CoreSearchOptions = {
  textQuery: string;
  decisionBodyIds: number[];
  tags: TagEnum[];
};

export type SearchOptions = CoreSearchOptions & {
  sortBy?: SortByOption;
  sortDirection?: SortDirectionOption;
  minimumDate?: Date;
  maximumDate?: Date;
};

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
