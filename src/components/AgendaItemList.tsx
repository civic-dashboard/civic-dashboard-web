'use client';

import { AgendaItemCard } from '@/components/AgendaItemCard';
import {
  DecisionBodyFilter,
  SearchBar,
  SearchProvider,
  ShowFullHistory,
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
import { Spinner } from '@/components/ui/spinner';
import { decisionBodies } from '@/constants/decisionBodies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

function ResultList() {
  const { searchResults, isLoadingMore, hasMoreSearchResults, getNextPage } =
    useSearch();

  const { sentinelRef } = useInfiniteScroll({
    isLoadingMore,
    hasMoreSearchResults,
    onLoadMore: getNextPage,
  });

  return (
    <>
      <Spinner show={searchResults === null} />
      {searchResults && (
        <>
          {searchResults.results.length === 0 && (
            <h4 className="mx-auto my-32">No results...</h4>
          )}
          {searchResults.results.map((item) => (
            <AgendaItemCard
              key={item.id}
              item={item}
              decisionBody={decisionBodies[item.decisionBodyId]}
            />
          ))}
          {hasMoreSearchResults &&
            (isLoadingMore ? (
              <Spinner show={isLoadingMore} />
            ) : (
              <div ref={sentinelRef} className="py-4 mt-4" />
            ))}
        </>
      )}
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
    if (
      !emailInputRef.current ||
      !emailInputRef.current.validity.valid ||
      searchResults === null
    ) {
      return;
    }
    await sendSearchResultsEmail({
      to: emailInputRef.current.value,
      props: { items: searchResults.results, searchOptions },
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

export function AgendaItemList() {
  return (
    <div className="flex-col space-y-4 p-4 max-w-[1000px]">
      <SearchProvider>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 items-center">
            <div className="flex flex-row space-x-4 justify-center self-stretch">
              <SearchBar />
            </div>
            <Tags />
            <div className="flex flex-row justify-around items-end flex-wrap self-stretch space-x-4 space-y-4">
              <DecisionBodyFilter decisionBodies={decisionBodies} />
              <div className="flex flex-row space-x-4 items-center">
                <SendEmail />
                <ShowFullHistory />
              </div>
            </div>
          </div>
          <ResultList />
        </div>
      </SearchProvider>
    </div>
  );
}
