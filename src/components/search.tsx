import { Search } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { allTags, Tag, TagEnum } from '@/constants/tags';
import { Checkbox, type CheckedState } from '@/components/ui/checkbox';
import { useSearch } from '@/contexts/SearchContext';

type DecisionBodyFilterProps = {
  decisionBodies: Record<string, DecisionBody>;
};
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

function TagToggle({ tagKey, tag }: { tagKey: TagEnum; tag: Tag }) {
  const { searchOptions, setSearchOptions } = useSearch();
  const isSelected = useMemo(
    () => searchOptions.tags.includes(tagKey),
    [searchOptions.tags, tagKey],
  );

  const onClick = useCallback(() => {
    setSearchOptions((opts) => {
      const newTags = opts.tags.includes(tagKey)
        ? opts.tags.filter((t) => t !== tagKey)
        : [...opts.tags, tagKey];

      return { ...opts, tags: newTags };
    });
  }, [tagKey, setSearchOptions]);

  return (
    <Badge
      variant={isSelected ? 'default' : 'secondary'}
      onClick={onClick}
      title={tag.searchQuery}
    >
      {tag.displayName}
    </Badge>
  );
}
export function Tags() {
  return (
    <div className="flex flex-row flex-wrap space-x-2 space-y-2 items-end justify-center max-w-[600px]">
      {Object.entries(allTags).map(([key, tag]) => (
        <TagToggle key={key} tagKey={key as TagEnum} tag={tag} />
      ))}
    </div>
  );
}

export function SearchBar() {
  const { setSearchOptions } = useSearch();

  return (
    <div className="flex flex-row space-x-2 items-center flex-1 max-w-[500px]">
      <Search />
      <Input
        className="py-1 px-2"
        onChange={(ev) =>
          setSearchOptions((opts) => ({ ...opts, textQuery: ev.target.value }))
        }
        placeholder="Search agenda items..."
      />
    </div>
  );
}

export function ShowFullHistory() {
  const { searchOptions, setSearchOptions } = useSearch();
  const onCheckedChange = useCallback(
    (checked: CheckedState) => {
      setSearchOptions((opts) => ({
        ...opts,
        minimumDate: checked === true ? undefined : new Date(),
      }));
    },
    [setSearchOptions],
  );

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={searchOptions.minimumDate === undefined}
        onCheckedChange={onCheckedChange}
        id="full-history"
      />
      <label
        htmlFor="full-history"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show full history
      </label>
    </div>
  );
}
