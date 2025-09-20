import { SearchSort } from '@/logic/search';

export const sortByFilterOptions: SearchSort[] = [
  {
    sortId: 1,
    sortLabel: 'Newest',
    sortBy: 'date',
    sortDirection: 'descending',
  },
  {
    sortId: 2,
    sortLabel: 'Oldest',
    sortBy: 'date',
    sortDirection: 'ascending',
  },
  {
    sortId: 3,
    sortLabel: 'Most Relevant',
    sortBy: 'relevance',
    sortDirection: 'descending',
  },
];
