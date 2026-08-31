'use client';

import { DecisionBody } from '@/api/decisionBody';
import { SearchResultAgendaItemCard } from '@/components/AgendaItemCard';
import {
  UpcomingPastToggle,
  ResultCount,
  SearchBar,
  SortDropdown,
  Tags,
  DecisionBodyFilter,
} from '@/components/search';
import { useEffect, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { SubscribeToSearchButton } from '@/components/subscribeToSearchButton';
import { usePathname, useRouter } from 'next/navigation';
import { isTag } from '@/constants/tags';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { areSearchFiltersEmpty } from '@/logic/search';

function AgendaListEmptyState() {
  const { searchOptions, timeRange, setTimeRange } = useSearch();

  const switchToPastItems = () => setTimeRange('past');

  // Fancy empty state when no upcoming items and empty search options (text query, decision bodies, tags)
  if (timeRange === 'upcoming') {
    if (areSearchFiltersEmpty(searchOptions)) {
      return (
        <div>
          <h2 className="mx-auto">No upcoming agenda items right now</h2>
          <h5 className="mx-auto">
            There are no upcoming meetings or agenda items scheduled at the
            moment. In the meantime, you can explore recent decisions or review
            how your councillor has voted.
          </h5>
          <div className="flex sm:flex-row flex-col justify-center sm:justify-start gap-3 my-5">
            <Button
              variant={'outline'}
              className="w-full sm:w-auto"
              onClick={switchToPastItems}
            >
              Browse Past Items
            </Button>

            <Link href={'/councillors'}>
              <Button variant={'outline'} className="w-full sm:w-auto">
                See How Your Councillor Voted
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  }
  // Display basic message for any other case
  return <h4 className="mx-auto my-32">No results...</h4>;
}

function ResultList({
  decisionBodies,
}: {
  decisionBodies: Record<number, DecisionBody>;
}) {
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
          {/* {If search results are empty} */}
          {searchResults.results.length === 0 && <AgendaListEmptyState />}
          {/* If search results are non-empty */}
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
              <div ref={sentinelRef} className="mt-4 py-4" />
            ))}
        </>
      )}
    </>
  );
}

type Props = {
  initialSearchParams: { [key: string]: string | string[] | undefined };
  decisionBodies: Record<number, DecisionBody>;
};

function AgendaItemListInner({ initialSearchParams, decisionBodies }: Props) {
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
    [decisionBodies],
  );

  return (
    <div className="flex flex-col items-stretch gap-y-4 p-4 max-w-full sm:max-w-max-content-width">
      <div className="mt-4 mb-2">
        <h1 className="font-bold text-2xl">Council activity</h1>
        <p>
          Here are agenda items that the City of Toronto will discuss at
          upcoming meetings. You can provide feedback on these items by
          submitting comments by email, which will be read at the meeting, or
          requesting to speak at the meeting live, in person or over video
          conferencing.
        </p>
      </div>
      <UpcomingPastToggle />
      <div className="flex flex-row items-center self-stretch gap-x-2">
        <div className="flex-grow">
          <SearchBar />
        </div>
        <div className="sm:max-w-max-content-width">
          <SortDropdown />
        </div>
      </div>
      <Tags />
      <hr />
      <DecisionBodyFilter
        decisionBodies={currentTermDecisionBodies}
      ></DecisionBodyFilter>
      <div className="flex flex-row flex-wrap justify-around items-end self-stretch gap-x-4 gap-y-4">
        <div className="flex justify-between items-end grow">
          <ResultCount />
          <SubscribeToSearchButton />
        </div>
      </div>
      <ResultList decisionBodies={decisionBodies} />
    </div>
  );
}

export function AgendaItemList({ initialSearchParams, decisionBodies }: Props) {
  return (
    <SearchProvider>
      <AgendaItemListInner
        initialSearchParams={initialSearchParams}
        decisionBodies={decisionBodies}
      />
    </SearchProvider>
  );
}
