import { SearchSort } from '@/logic/search';

export const sortByFilterOptions: SearchSort[] = [
  {
    sortId: 1,
    sortLabel: 'Latest first',
    sortBy: 'date',
    sortDirection: 'descending',
  },
  {
    sortId: 2,
    sortLabel: 'Earliest first',
    sortBy: 'date',
    sortDirection: 'ascending',
  },
  {
    sortId: 3,
    sortLabel: 'Most relevant',
    sortBy: 'relevance',
    sortDirection: 'descending',
  },
];
