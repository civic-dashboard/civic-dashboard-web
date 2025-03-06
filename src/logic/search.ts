import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import { TagEnum } from '@/constants/tags';
import type {
  SortByOption,
  SortDirectionOption,
} from '@/database/queries/agendaItems';

export type SearchOptions = {
  query: string;
  decisionBodyId?: string;
  tags: TagEnum[];
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
  if (options.query) {
    searchParams.set('textQuery', options.query);
  }
  if (options.decisionBodyId) {
    searchParams.set('decisionBodyId', options.decisionBodyId);
  }
  if (options.tags.length > 0) {
    searchParams.set('tags', options.tags.join(','));
  }
  searchParams.set('page', pagination.page.toString());
  searchParams.set('pageSize', pagination.pageSize.toString());
  const sortBy =
    options.sortBy ??
    (options.query || options.tags.length > 0 ? 'relevance' : 'date');
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
