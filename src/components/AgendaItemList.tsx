'use client';

import { DecisionBody } from '@/api/decisionBody';
import { AgendaItem } from '@/api/agendaItem';
import { AgendaItemCard } from '@/components/AgendaItemCard';
import {
  DecisionBodyFilter,
  SearchBar,
  SearchProvider,
  Tags,
  useSearch,
} from '@/components/search';
import { Button } from './ui/button';
import { useCallback, useEffect, useState } from 'react';
import { sendSearchResultsEmail } from '@/backend/sendSearchResultsEmail';

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
      {searchResults.length === 0 && <h4>No results...</h4>}
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

export function SendEmail() {
  const { searchResults, searchOptions } = useSearch();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(false);
  }, [searchResults]);
  const onClick = useCallback(async () => {
    await sendSearchResultsEmail({ items: searchResults, searchOptions });
    setSent(true);
  }, [searchResults, searchOptions]);

  return (
    <Button onClick={sent ? undefined : onClick}>
      {sent ? 'Sent!' : 'Send It!'}
    </Button>
  );
}

export function AgendaItemList({ items, decisionBodies }: Props) {
  return (
    <div className="flex-col space-y-4 p-4 bg-slate-200">
      <SearchProvider items={items}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-4">
              <SearchBar />
              <SendEmail />
            </div>
            <DecisionBodyFilter decisionBodies={decisionBodies} />
            <Tags />
          </div>
          <ResultList decisionBodies={decisionBodies} />
        </div>
      </SearchProvider>
    </div>
  );
}
