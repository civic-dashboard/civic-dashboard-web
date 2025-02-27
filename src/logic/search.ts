import type { AgendaItemSearchResponse } from '@/app/api/agenda-item/search/route';
import type {
  SortByOption,
  SortDirectionOption,
} from '@/database/queries/agendaItems';

export const tags = {
  housing: [
    'renoviction',
    'rent control',
    'public housing',
    'vacant homes tax',
    'property tax',
  ],
  bikes: ['bicycle'],
  homelessness: ['shelter', 'addiction', 'drugs', 'harm reduction'],
  dogs: ['dog'],
  parks: ['park'],
  construction: [],
  traffic: [],
  transit: [],
  noise: [],
  energy: [],
  climate: [],
  infrastructure: ['storm drains', 'bathrooms', 'internet', 'broadband'],
  safety: ['police', 'crisis response', 'public safety'],
  arts: ['culture'],
  'child care': [],
  democracy: [
    'ranked choice',
    'democratic engagement',
    'democratic accessibility',
  ],
  'cost of living': [],
  healthcare: ['mental health'],
  equity: [],
  business: [],
} as const;

export type SearchOptions = {
  query: string;
  decisionBodyId?: string;
  tags: string[];
  sortBy?: SortByOption;
  sortDirection?: SortDirectionOption;
  minimumDate?: Date;
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
  searchParams.set('page', pagination.page.toString());
  searchParams.set('pageSize', pagination.pageSize.toString());
  const sortBy = options.sortBy ?? (options.query ? 'relevance' : 'date');
  searchParams.set('sortBy', sortBy);
  searchParams.set(
    'sortDirection',
    options.sortDirection ??
      (sortBy === 'relevance' ? 'descending' : 'ascending'),
  );
  if (options.minimumDate) {
    searchParams.set('minimumDate', options.minimumDate?.getTime().toString());
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
