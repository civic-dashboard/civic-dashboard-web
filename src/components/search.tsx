import { CalendarChevronsRight, Check, RotateCcwClock, Search } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import React, { useCallback, useMemo } from 'react';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { ChipButton } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { allTags, Tag, TagEnum } from '@/constants/tags';
import { useSearch } from '@/contexts/SearchContext';
import { logAnalytics } from '@/api/analytics';
import { sortByFilterOptions } from '@/constants/sortByFilterOptions';

type DecisionBodyFilterProps = {
  decisionBodies: Record<string, DecisionBody>;
};

export function SortDropdown() {
  const {
    searchOptions: { sortBy, sortDirection },
    setSearchOptions,
  } = useSearch();

  // Use sortByFilterOptions instead of sortByOptions
  const options = useMemo(
    () =>
      sortByFilterOptions.map((opt) => ({
        id: opt.sortId as number,
        label: opt.sortLabel as
          | 'Earliest first'
          | 'Latest first'
          | 'Most relevant',
      })),
    [],
  );

  const onSelect = useCallback(
    (selectedId: number) => {
      const selectedOption = sortByFilterOptions.find(
        (opt) => opt.sortId === selectedId,
      );
      setSearchOptions((opts) => ({
        ...opts,
        sortBy: selectedOption?.sortBy as 'date' | 'relevance',
        sortDirection: selectedOption?.sortDirection as
          | 'ascending'
          | 'descending'
          | undefined,
      }));
    },
    [setSearchOptions],
  );

  // Find the selected option's id based on sortBy value
  const selectedId = useMemo(() => {
    const selectedOption = sortByFilterOptions.find(
      (opt) => opt.sortBy === sortBy && opt.sortDirection === sortDirection,
    );
    return selectedOption?.sortId;
  }, [sortBy, sortDirection]);
  return (
    <Combobox
      options={options}
      value={selectedId}
      onSelect={onSelect}
      defaultValue={options.find((opt) => opt.label === 'Most Relevant')?.id}
      placeholder="Sort by..."
      multiple={false}
      searchable={false}
      reorderSelected={false}
    />
  );
}

export function DecisionBodyFilter({
  decisionBodies,
}: DecisionBodyFilterProps) {
  const {
    searchOptions: { decisionBodyIds },
    setSearchOptions,
  } = useSearch();

  const options = useMemo(
    () =>
      Object.values(decisionBodies).map(
        ({ decisionBodyId, decisionBodyName }) => ({
          id: decisionBodyId,
          label: decisionBodyName,
        }),
      ),
    [decisionBodies],
  );

  const onSelect = useCallback(
    (selectedId: number) => {
      setSearchOptions((opts) => ({
        ...opts,
        decisionBodyIds: opts.decisionBodyIds.includes(selectedId)
          ? opts.decisionBodyIds.filter((id) => id !== selectedId)
          : [...opts.decisionBodyIds, selectedId],
      }));
    },
    [setSearchOptions],
  );

  return (
    <Combobox
      options={options}
      multiple
      value={decisionBodyIds}
      onSelect={onSelect}
      placeholder="Committees"
      staticLabel="Committees"
      onClear={() =>
        setSearchOptions((opts) => ({ ...opts, decisionBodyIds: [] }))
      }
      resetScrollOnSearch
    />
  );
}

export function UpcomingPastToggle() {
  type TimeRangeType = 'upcoming' | 'past';
  const { timeRange, setTimeRange } = useSearch();

  // Setting time range using context provided setter
  const handleDateRange = (selectedRange: TimeRangeType) => {
    setTimeRange(selectedRange);
  };

  return (
    <div className="w-[350px]" role="tablist">
      <div className="grid grid-cols-2">
        <Button
          role="tab"
          aria-selected={timeRange === 'upcoming'}
          onClick={() => handleDateRange('upcoming')}
          variant={timeRange === 'upcoming' ? 'default' : 'outline'}
          className="h-full"
        >
          <CalendarChevronsRight size={20} strokeWidth={2} />
          Upcoming
        </Button>
        </Button>

        <Button
          role="tab"
          aria-selected={timeRange === 'past'}
          onClick={() => handleDateRange('past')}
          variant={timeRange === 'past' ? 'default' : 'outline'}
          className="h-full"
        >
          <RotateCcwClock size={20} strokeWidth={2} />
            Past
        </Button>
      </div>
    </div>
  );
}

function TagToggle({ tagKey, tag }: { tagKey: TagEnum; tag: Tag }) {
  const { searchOptions, setSearchOptions } = useSearch();
  const isSelected = useMemo(
    () => searchOptions.tags.includes(tagKey),
    [searchOptions.tags, tagKey],
  );

  const onClick = useCallback(() => {
    setSearchOptions((opts) => {
      const isSelected = opts.tags.includes(tagKey);
      const newTags = isSelected
        ? opts.tags.filter((t) => t !== tagKey)
        : [...opts.tags, tagKey];

      logAnalytics(isSelected ? 'Tag unselect' : 'Tag select', { tag: tagKey });

      return { ...opts, tags: newTags };
    });
  }, [tagKey, setSearchOptions]);

  return (
    <ChipButton
      className="sm:text-wrap text-nowrap cursor-pointer"
      variant={isSelected ? 'sky' : 'secondary'}
      onClick={onClick}
      title={tag.searchQuery}
    >
      {isSelected && <Check size={16} />}
      {tag.displayName}
    </ChipButton>
  );
}
export function Tags() {
  const { searchOptions, setSearchOptions } = useSearch();

  return (
    <div className="sm:m-0 mr-[-1rem] ml-[-1rem] max-w-[100vh] sm:max-w-full">
      {searchOptions.tags.length > 0 && (
        <div className="flex justify-end px-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 min-w-0 h-auto"
            onClick={() => setSearchOptions((opts) => ({ ...opts, tags: [] }))}
          >
            Clear
          </Button>
        </div>
      )}
      <div
        className="flex sm:flex-wrap sm:justify-center gap-x-2 sm:gap-y-2 px-4 overflow-x-scroll scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {Object.entries(allTags).map(([key, tag]) => (
          <TagToggle key={key} tagKey={key as TagEnum} tag={tag} />
        ))}
      </div>
    </div>
  );
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { setSearchOptions } = useSearch();

  return (
    <div className={cn('flex justify-center', compact && 'justify-start')}>
      <div className="flex flex-col items-stretch w-full max-w-[200px]">
        <div
          className={cn(
            'flex flex-1 items-center gap-x-2 bg-gray-light p-1 px-3 text-black',
            compact
              ? 'bg-gray-lightest border border-2 border-gray-lightest focus-within:border-primary focus-within:bg-white'
              : 'bg-neutral-100 dark:bg-neutral-800',
          )}
        >
          <Search className="text-gray-500 dark:text-neutral-400" />
          <Input
            className="bg-transparent dark:bg-transparent px-2 py-1 border-none"
            onChange={(ev) =>
              setSearchOptions((opts) => ({
                ...opts,
                textQuery: ev.target.value,
              }))
            }
            placeholder={
              compact ? 'Search' : 'Search by topic, councillor, or item'
            }
          />
        </div>
        {/* <span className="p-1 pl-4 text-[10px] text-neutral-600 dark:text-neutral-400">
          Feel free to use AND, OR, NOT - learn more about search operators
        </span> */}
      </div>
    </div>
  );
}

export function ResultCount() {
  const totalCount = useSearch().searchResults?.totalCount;
  return <span>{totalCount && <>{totalCount} results</>}</span>;
}
