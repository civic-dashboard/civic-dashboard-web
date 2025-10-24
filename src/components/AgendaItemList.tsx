'use client';

import { SearchResultAgendaItemCard } from '@/components/AgendaItemCard';
import {
  AdvancedFilters,
  ResultCount,
  SearchBar,
  Tags,
} from '@/components/search';
import { useEffect, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { decisionBodies } from '@/constants/decisionBodies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { SubscribeToSearchButton } from '@/components/subscribeToSearchButton';
import { usePathname, useRouter } from 'next/navigation';
import { isTag } from '@/constants/tags';

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
            <SearchResultAgendaItemCard
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

type Props = {
  initialSearchParams: { [key: string]: string | string[] | undefined };
};

function AgendaItemListInner({ initialSearchParams }: Props) {
  const { searchOptions, setSearchOptions } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Read initial query params from server-side rendered URL.
    //
    // TODO: We're only reading/setting tags in the url right now,
    // but in the future, we can support other search/filter options.
    const tags =
      typeof initialSearchParams.tag === 'string'
        ? [initialSearchParams.tag]
        : initialSearchParams.tag || [];
    const validTags = tags.filter(isTag);

    setSearchOptions((opts) => ({ ...opts, tags: validTags }));
    // This only runs once; passing empty deps array on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Whenever search options change, update url to reflect these changes.
    //
    // TODO: We're only reading/setting tags in the url right now,
    // but in the future, we can support other search/filter options.
    const tags = searchOptions.tags;

    const params = new URLSearchParams();
    for (const i in tags) {
      params.append('tag', tags[i]);
    }

    const queryString = params.toString();
    const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(updatedPath);
  }, [searchOptions, router, pathname]);

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
    <div className="flex flex-col space-y-4 p-4 items-stretch max-w-full sm:max-w-max-content-width">
      <SearchBar />
      <Tags />
      <hr />
      <AdvancedFilters decisionBodies={currentTermDecisionBodies} />
      <div className="flex flex-row justify-around items-end flex-wrap self-stretch space-x-4 space-y-4">
        <div className="flex grow justify-between items-end">
          <ResultCount />
          <SubscribeToSearchButton />
        </div>
      </div>
      <ResultList />
    </div>
  );
}

export function AgendaItemList({ initialSearchParams }: Props) {
  return (
    <SearchProvider>
      <AgendaItemListInner initialSearchParams={initialSearchParams} />
    </SearchProvider>
  );
}
