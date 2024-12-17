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
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { sendSearchResultsEmail } from '@/backend/emails/sendSearchResultsEmail';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

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
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSent(false);
  }, [searchResults]);
  const onClick = useCallback(async () => {
    if (!emailInputRef.current || !emailInputRef.current.validity.valid) {
      return;
    }
    await sendSearchResultsEmail({
      to: emailInputRef.current.value,
      props: { items: searchResults, searchOptions },
    });
    setSent(true);
  }, [searchResults, searchOptions]);

  return (
    <Popover onOpenChange={(isOpen) => isOpen && setSent(false)}>
      <PopoverTrigger asChild>
        <Button>Send Results to Email</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-row space-x-2">
          <Input
            ref={emailInputRef}
            type="email"
            placeholder="Enter email..."
          ></Input>
          <Button onClick={onClick}>{sent ? 'Sent' : 'Send'}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AgendaItemList({ items, decisionBodies }: Props) {
  return (
    <div className="flex-col space-y-4 p-4 max-w-[1000]">
      <SearchProvider items={items}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 items-center">
            <div className="flex flex-row space-x-4 justify-center self-stretch">
              <SearchBar />
            </div>
            <Tags />
            <div className="flex flex-row justify-around items-end flex-wrap self-stretch space-x-4 space-y-4">
              <DecisionBodyFilter decisionBodies={decisionBodies} />
              <SendEmail />
            </div>
          </div>
          <ResultList decisionBodies={decisionBodies} />
        </div>
      </SearchProvider>
    </div>
  );
}
