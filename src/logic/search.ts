import { AgendaItem } from '@/api/agendaItem';
import FlexSearch from 'flexsearch';

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

export type TaggedAgendaItem = AgendaItem & { tags: string[] };

export type SearchOptions = {
  query: string;
  decisionBodyId?: string;
  tags: string[];
};

function tagItem(item: AgendaItem): TaggedAgendaItem {
  const miniIndex = new FlexSearch.Document<AgendaItem, true>({
    tokenize: 'forward',
    document: {
      id: 'id',
      index: ['agendaItemTitle', 'decisionBodyName', 'agendaItemSummary'],
      store: true,
    },
  });

  miniIndex.add(item);

  const validTags = Object.entries(tags)
    .filter(([tag, extra]) => {
      return [tag, ...extra].some((val) => miniIndex.search(val).length > 0);
    })
    .map(([tag]) => tag);

  return { ...item, tags: validTags };
}

export function createSearchIndex(items: AgendaItem[]) {
  const searchIndex = new FlexSearch.Document<TaggedAgendaItem, true>({
    tokenize: 'forward',
    document: {
      id: 'id',
      index: ['agendaItemTitle', 'decisionBodyName', 'agendaItemSummary'],
      store: true,
    },
  });

  const taggedItems = items.map(tagItem);

  for (const item of taggedItems) {
    searchIndex.add(item);
  }

  return function (options: SearchOptions): TaggedAgendaItem[] {
    let filteredResults: TaggedAgendaItem[];
    if (options.query === '') {
      filteredResults = taggedItems;
    } else {
      filteredResults = [];
      const results = searchIndex.search(options.query, undefined, {
        enrich: true,
      });
      const existingKeys = new Set<string>();
      for (const fieldResult of results) {
        const filteredResult = fieldResult.result
          .map((r) => r.doc)
          .filter((d) => !existingKeys.has(d.id));
        filteredResults.push(...filteredResult);
        filteredResult.forEach((d) => existingKeys.add(d.id));
      }
    }

    if (options.decisionBodyId !== undefined) {
      filteredResults = filteredResults.filter(
        (item) => item.decisionBodyId.toString() === options.decisionBodyId
      );
    }

    if (options.tags.length > 0) {
      filteredResults = filteredResults.filter((item) => {
        console.log(
          options.tags,
          item.tags,
          options.tags.some((tag) => item.tags.includes(tag))
        );
        return options.tags.some((tag) => item.tags.includes(tag));
      });
    }

    return filteredResults;
  };
}
