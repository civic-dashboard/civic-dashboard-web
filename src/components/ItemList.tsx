'use client';

import { DecisionBody } from '@/api/decisionbody';
import { AgendaItem } from '@/api/item';
import { ItemCard } from '@/components/ItemCard';
import FlexSearch from 'flexsearch';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  items: AgendaItem[];
  decisionBodies: Record<string, DecisionBody>;
};

export function ItemList({ items, decisionBodies }: Props) {
  const [searchText, setSearchText] = useState('');

  const searchIndex = useMemo(() => {
    const searchIndex = new FlexSearch.Document<AgendaItem, true>({
      tokenize: 'forward',
      document: {
        id: 'id',
        index: ['agendaItemTitle', 'decisionBodyName', 'agendaItemSummary'],
        store: true,
      },
    });

    for (const item of items) {
      searchIndex.add(item);
    }

    return searchIndex;
  }, [items]);

  const searchResults = useMemo(() => {
    if (searchText === '') {
      return items;
    }
    const results = searchIndex.search(searchText, undefined, { enrich: true });
    const filteredResults = [];
    const existingKeys = new Set<string>();
    for (const fieldResult of results) {
      const filteredResult = fieldResult.result
        .map((r) => r.doc)
        .filter((d) => !existingKeys.has(d.id));
      filteredResults.push(...filteredResult);
      filteredResult.forEach((d) => existingKeys.add(d.id));
    }
    return filteredResults;
  }, [searchIndex, searchText]);

  return (
    <div className="flex-col space-y-4 p-4 bg-slate-200">
      <div className="flex flex-row space-x-2 items-center">
        <Search />
        <input
          className="p-1 flex-1"
          onChange={(ev) => setSearchText(ev.target.value)}
          placeholder="Search agenda items..."
        />
      </div>
      {searchResults.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          decisionBody={decisionBodies[item.decisionBodyId]}
        />
      ))}
    </div>
  );
}
