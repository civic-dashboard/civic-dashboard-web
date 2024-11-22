'use client';

import { DecisionBody } from '@/api/decisionBody';
import { AgendaItem } from '@/api/agendaItem';
import { AgendaItemCard } from '@/components/AgendaItemCard';
import { SearchBar, SearchProvider, useSearch } from '@/components/search';

type Props = {
  items: AgendaItem[];
  decisionBodies: Record<string, DecisionBody>;
};

function ResultList({
  decisionBodies,
}: {
  decisionBodies: Record<string, DecisionBody>;
}) {
  const { searchResults } = useSearch();

  return (
    <>
      {searchResults.map((item) => (
        <AgendaItemCard
          key={item.id}
          item={item}
          decisionBody={decisionBodies[item.decisionBodyId]}
        />
      ))}
    </>
  );
}

export function AgendaItemList({ items, decisionBodies }: Props) {
  return (
    <div className="flex-col space-y-4 p-4 bg-slate-200">
      <SearchProvider items={items}>
        <SearchBar />
        <ResultList decisionBodies={decisionBodies} />
      </SearchProvider>
    </div>
  );
}
