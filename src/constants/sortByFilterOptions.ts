import { SearchSort } from '@/logic/search';

export const sortByFilterOptions: SearchSort[] = [
  {
    sortId: 1,
    sortLabel: 'Newest first',
    sortBy: 'date',
    sortDirection: 'descending',
  },
  {
    sortId: 2,
    sortLabel: 'Oldest first',
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
