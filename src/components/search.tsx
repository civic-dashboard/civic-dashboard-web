import { Check, Search } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from '@/components/ui/combobox';
import { ChipButton } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { allTags, Tag, TagEnum } from '@/constants/tags';
import { useSearch } from '@/contexts/SearchContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
        label: opt.sortLabel as 'Oldest' | 'Newest' | 'Most Relevant',
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

export function UpcomingPastSwitch() {
  type TimeRangeType = 'upcoming' | 'past';
  const { setSearchOptions } = useSearch();
  const updateItemsType = useCallback(
    (selectedRange: TimeRangeType) => {
      setSearchOptions((opts) => ({
        ...opts,
        minimumDate: selectedRange === 'past' ? undefined : new Date(),
      }));
    },
    [setSearchOptions],
  );

  const [active, setActive] = useState('upcoming');

  const handleDateRange = (selectedRange: TimeRangeType) => {
    updateItemsType(selectedRange);
    setActive(selectedRange);
  };

  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex gap-6">
        <button
          onClick={() => handleDateRange('upcoming')}
          className={`pb-2 text-lg font-semibold ${
            active === 'upcoming'
              ? 'text-gray-800 border-b-2 border-gray-700'
              : 'text-gray-400'
          }`}
        >
          Upcoming items
        </button>

        <button
          onClick={() => handleDateRange('past')}
          className={`pb-2 text-lg font-semibold ${
            active === 'past'
              ? 'text-gray-800 border-b-2 border-gray-700'
              : 'text-gray-400'
          }`}
        >
          Past items
        </button>
      </div>
    </div>
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
      placeholder="Select decision body..."
    />
  );
}

type AdvancedFiltersProps = DecisionBodyFilterProps;
export function AdvancedFilters({ decisionBodies }: AdvancedFiltersProps) {
  return (
    <Accordion type="multiple">
      <AccordionItem value="advanced-filters">
        <AccordionTrigger>Open Advanced Filter</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-y-6 gap-x-8">
            <DecisionBodyFilter decisionBodies={decisionBodies} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
      className="text-nowrap sm:text-wrap"
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
  return (
    <div className="ml-[-1rem] mr-[-1rem] max-w-[100vh] sm:max-w-full sm:m-0">
      <div
        className="flex gap-x-2 overflow-x-scroll scrollbar-none px-4 sm:flex-wrap sm:gap-y-2 sm:justify-center"
        style={{ scrollbarWidth: 'none' }}
      >
        {Object.entries(allTags).map(([key, tag]) => (
          <TagToggle key={key} tagKey={key as TagEnum} tag={tag} />
        ))}
      </div>
    </div>
  );
}

export function SearchBar() {
  const { setSearchOptions } = useSearch();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full max-w-[500px] items-stretch">
        <div className="flex space-x-2 items-center flex-1 p-1 px-3 rounded-[28px] bg-neutral-100 dark:bg-neutral-800">
          <Input
            className="border-none py-1 px-2 bg-transparent dark:bg-transparent"
            onChange={(ev) =>
              setSearchOptions((opts) => ({
                ...opts,
                textQuery: ev.target.value,
              }))
            }
            placeholder="Search by topic, councillor, or item"
          />
          <Search className="text-neutral-600 dark:text-neutral-400" />
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
