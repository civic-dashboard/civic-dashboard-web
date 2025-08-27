import { SearchSort } from '@/logic/search';

export const sortByFilterOptions: Record<number, SearchSort> = {
  1: {
    sortId: 1,
    sortLabel: 'Newest',
    sortBy: 'date',
    sortDirection: 'descending',
  },
  2: {
    sortId: 2,
    sortLabel: 'Oldest',
    sortBy: 'date',
    sortDirection: 'ascending',
  },
  3: {
    sortId: 3,
    sortLabel: 'Most Relevant',
    sortBy: 'relevance',
    sortDirection: 'descending',
  },
  4: {
    sortId: 4,
    sortLabel: 'Least Relevant',
    sortBy: 'relevance',
    sortDirection: 'ascending',
  },
};
