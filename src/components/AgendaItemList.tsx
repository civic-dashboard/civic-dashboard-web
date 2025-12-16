'use client';

import { SearchResultAgendaItemCard } from '@/components/AgendaItemCard';
import {
  AdvancedFilters,
  ResultCount,
  SearchBar,
  SortDropdown,
  Tags,
} from '@/components/search';
import { useEffect, useMemo, useState, useRef } from 'react';
import { LngLatBounds, Map, Marker, NavigationControl, Popup } from '@vis.gl/react-maplibre';
import type {MapRef} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Spinner } from '@/components/ui/spinner';
import { decisionBodies } from '@/constants/decisionBodies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { SubscribeToSearchButton } from '@/components/subscribeToSearchButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AgendaItem } from '@/database/queries/agendaItems';

const latitudeCenter = 43.7320;
const longitudeCenter = -79.4269;

type MapPinInfo = {
  agendaItem: AgendaItem;
  latitude: number;
  longitude: number;
};
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

  const [popupInfo, setPopupInfo] = useState<MapPinInfo | null>(null);

  const mapRef = useRef<MapRef>(null);

  const [showSearchCurrent, setShowSearchCurrent] = useState<boolean>(false);
  const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);

  const filteredSearchResults = useMemo(
    () => (searchResults) && (
      (mapRef && mapRef.current && mapBounds &&
        searchResults.results.filter((item) =>
          (!item.geoLocation) || (
            item.geoLocation.some(
              (location) => mapBounds.contains([parseFloat(location.split(',')[1]), parseFloat(location.split(',')[0])])
            )
          )
        )
      ) || (searchResults.results)), [searchResults, mapBounds]);

  const pins = useMemo(
    () => filteredSearchResults && (
      filteredSearchResults.map(
        (item) => !item.geoLocation ? null : 
          Object.entries(item.geoLocation).map( ([key, location]) => 
            <Marker 
              longitude={parseFloat(location.split(',')[1])} 
              latitude={parseFloat(location.split(',')[0])} 
              anchor='bottom' 
              key={`${item.id}-${key}`}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({agendaItem: item,
                  longitude: parseFloat(location.split(',')[1]), 
                  latitude: parseFloat(location.split(',')[0])
                });
              }}/>)).filter(x => !!x).flat()),
    [searchResults, mapBounds]
  );

  const onMapMove = () => {
    if (mapRef && mapRef.current){
      setShowSearchCurrent(true);
    }
  };

  const onSearchCurrent = () => {
    if (mapRef && mapRef.current){
      setMapBounds(mapRef.current?.getBounds());
    }
  };

  return (
    <>
      <Map 
      ref={mapRef}
      initialViewState={{longitude: longitudeCenter, latitude: latitudeCenter, zoom: 9.0}} 
      mapStyle='https://tiles.openfreemap.org/styles/bright' 
      style={{width: '100%', height: '350px'}}
      onMoveEnd={onMapMove}
      onMoveStart={() => setShowSearchCurrent(false)}
      onLoad={(event) => {setMapBounds(event.target.getBounds())}} >
        {pins}
        <NavigationControl />
        {showSearchCurrent && mapRef && mapRef.current && (
          <Popup
            latitude={mapRef.current.getBounds().getNorth()}
            longitude={mapRef.current.getBounds().getCenter().lng}
            anchor='top'
            closeButton={false}
            onClose={() => setShowSearchCurrent(false)}
            className='search-current-map'
          >
            <Button
              size="sm"
              variant="secondary-opposite"
              onClick={() => {onSearchCurrent(); setShowSearchCurrent(false)}}
            >
              Search This Area
            </Button>
          </Popup>
        )}
        {popupInfo && (
          <Popup
            anchor='top'
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeOnClick={true}
          >
            <div>
              <b>{popupInfo.agendaItem.agendaItemTitle}</b>
              <br />
              {new Date(popupInfo.agendaItem.meetingDate)
                .toLocaleString('default', {
                  month: 'short',
                  year: 'numeric',
                  day: 'numeric',
                })
                .replace(',', '')}
              <br />
              <Link href={`/actions/item/${popupInfo.agendaItem.reference}`} target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="grow sm:flex-initial"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </Popup>
        )}
      </Map>
      <Spinner show={searchResults === null} />
      {filteredSearchResults && (
        <>
          {filteredSearchResults.length === 0 && (
            <h4 className="mx-auto my-32">No results...</h4>
          )}
          {filteredSearchResults.map((item) => (
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
      <div className="mt-4 mb-2">
        <h1 className="text-2xl font-bold">Actions</h1>
        <p>
          Here are agenda items that the City of Toronto will discuss at
          upcoming meetings. You can provide feedback on these items by
          submitting comments by email, which will be read at the meeting, or
          requesting to speak at the meeting live, in person or over video
          conferencing.
        </p>
      </div>
      <hr />
      <div className="flex flex-row self-stretch items-center space-x-2">
        <div className="flex-grow">
          <SearchBar />
        </div>
        <div className="sm:max-w-max-content-width">
          <SortDropdown />
        </div>
      </div>
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
