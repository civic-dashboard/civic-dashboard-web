'use client';

import { AgendaItemCard } from '@/components/AgendaItemCard';
import {
  DecisionBodyFilter,
  SearchBar,
  ShowFullHistory,
  Tags,
} from '@/components/search';
import { useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { decisionBodies } from '@/constants/decisionBodies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { SubscribeToSearchButton } from '@/components/subscribeToSearchButton';

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

export function AgendaItemList() {
  const currentTermDecisionBodies = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(decisionBodies).filter(
          ([_, body]) => body.termId === CURRENT_COUNCIL_TERM,
        ),
      ),
    [],
  );

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
              <DecisionBodyFilter decisionBodies={currentTermDecisionBodies} />
              <div className="flex flex-row space-x-4 items-center">
                <SubscribeToSearchButton />
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
