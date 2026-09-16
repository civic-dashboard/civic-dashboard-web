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
import { Text } from '@/components/ui/text-items';
import { ChevronDown } from 'lucide-react';

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
    <div className="flex flex-col gap-y-10 px-6 lg:px-12 py-12 w-full max-w-6xl">
      <Text preset="Heading2" tag="h1">
        Council Activity
      </Text>
      <section>
        <div className="flex sm:flex-row flex-col justify-end sm:items-center gap-4 dark:bg-neutral-800 pb-2 border-gray-300 border-b text-gray-dark dark:text-gray-300">
          <div className="mr-auto">
            <UpcomingPastToggle />
          </div>
          <SortDropdown />
          <details className="relative">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <summary className="cursor-pointer list-none">Topics <ChevronDown className="w-4 h-4 shrink-0" /></summary>
            </Button>
            <div className="left-0 z-10 absolute space-y-4 bg-white dark:bg-neutral-800 shadow-lg mt-3 p-4 border border-gray-light w-[min(30rem,calc(100vw-3rem))]">
              <Tags />
            </div>
          </details>
          <DecisionBodyFilter decisionBodies={currentTermDecisionBodies} />
          <div className="w-full sm:max-w-[18rem]">
            <SearchBar compact />
          </div>
        </div>
      </section>
      <div className="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-4">
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
