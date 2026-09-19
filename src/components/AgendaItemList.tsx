'use client';

import { DecisionBody } from '@/api/decisionBody';
import {
  SearchResultAgendaItemCard,
  SearchResultMeetingDetails,
} from '@/components/AgendaItemCard';
import {
  UpcomingPastToggle,
  ResultCount,
  SearchBar,
  SortDropdown,
  Tags,
  DecisionBodyFilter,
} from '@/components/search';
import { useEffect, useMemo, useRef } from 'react';
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

function ResultList() {
  const {
    searchResults,
    isLoadingMore,
    hasMoreSearchResults,
    getNextPage,
    timeRange,
  } = useSearch();

  const { sentinelRef } = useInfiniteScroll({
    isLoadingMore,
    hasMoreSearchResults,
    onLoadMore: getNextPage,
  });

  const meetingGroups = searchResults?.results.reduce(
    (groups, item) => {
      const previousGroup = groups[groups.length - 1];

      if (
        timeRange === 'past' &&
        previousGroup?.[0].meetingId === item.meetingId
      ) {
        previousGroup.push(item);
      } else {
        groups.push([item]);
      }

      return groups;
    },
    [] as (typeof searchResults.results)[],
  );

  return (
    <>
      <Spinner show={searchResults === null} />
      {searchResults && (
        <>
          {/* {If search results are empty} */}
          {searchResults.results.length === 0 && <AgendaListEmptyState />}
          {/* If search results are non-empty */}
          {meetingGroups?.map((items) => (
            <section
              className={`gap-4 sm:gap-6 grid sm:grid-cols-[16rem_minmax(0,1fr)] mb-4`}
              key={items[0].meetingId}
            >
              <SearchResultMeetingDetails item={items[0]} />
              <div>
                {items.map((item, itemIndex) => (
                  <SearchResultAgendaItemCard
                    className={itemIndex === 0 ? '' : 'mt-3'}
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </section>
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
  const topicsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeTopicsOnOutsideClick = (event: PointerEvent) => {
      const topics = topicsRef.current;
      if (
        topics &&
        event.target instanceof Node &&
        !topics.contains(event.target)
      ) {
        topics.open = false;
      }
    };

    document.addEventListener('pointerdown', closeTopicsOnOutsideClick);
    return () =>
      document.removeEventListener('pointerdown', closeTopicsOnOutsideClick);
  }, []);

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
    <div className="flex flex-col gap-y-4 mx-auto px-4 sm:px-6 lg:px-12 lg:px-16 py-12 md:py-7 w-full max-w-6xl">
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
          <Text preset="Heading2" tag="h1" className="mb-0">
            Council Activity
          </Text>
          <SubscribeToSearchButton />
        </div>
        <Text className="mb-0" preset="Body">
          Browse agenda items from upcoming and past City Council and committee
          meetings.
        </Text>
      </div>
      <section>
        <div className="flex lg:flex-row flex-col justify-between sm:items-stretch gap-4 dark:bg-neutral-800 pb-3 border-gray-light border-b text-gray-dark dark:text-gray-30">
          <UpcomingPastToggle />
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-y-2 sm:gap-1">
            <SortDropdown />
            <details ref={topicsRef} className="relative">
              <Button asChild variant="searchFilter" className="gap-1">
                <summary className="cursor-pointer list-none">
                  <span className="relative">
                    Topics
                    {searchOptions.tags.length > 0 && (
                      <span className="-top-2 -right-3 absolute flex justify-center items-center bg-green-700 px-1 rounded-full min-w-[14px] h-[14px] font-bold text-[10px] text-white leading-none">
                        {searchOptions.tags.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </summary>
              </Button>
              <div className="left-0 z-10 absolute space-y-4 bg-white dark:bg-neutral-800 shadow-lg mt-3 p-4 border border-gray-light w-[min(30rem,calc(100vw-3rem))]">
                <Tags />
              </div>
            </details>
            <DecisionBodyFilter decisionBodies={currentTermDecisionBodies} />
            <div className="order-1 sm:ml-auto lg:ml-4 w-full md:max-w-[18rem]">
              <SearchBar compact />
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-row flex-wrap justify-end items-end gap-x-4 gap-y-4">
        <div className="flex justify-between items-end mb-2 text-gray-dark text-sm grow">
          <ResultCount />
        </div>
      </div>
      <ResultList />
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
