import { Search } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { allTags, Tag, TagEnum } from '@/constants/tags';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useSearch } from '@/contexts/SearchContext';

type DecisionBodyFilterProps = {
  decisionBodies: Record<string, DecisionBody>;
};
export function DecisionBodyFilter({
  decisionBodies,
}: DecisionBodyFilterProps) {
  const {
    searchOptions: { decisionBodyId },
    setSearchOptions,
  } = useSearch();

  const options = useMemo(
    () =>
      Object.entries(decisionBodies).map(([id, { decisionBodyName }]) => ({
        id,
        label: decisionBodyName,
      })),
    [decisionBodies],
  );

  const onSelect = useCallback(
    (id: string) => {
      setSearchOptions((opts) => ({
        ...opts,
        decisionBodyId: id === opts.decisionBodyId ? undefined : id,
      }));
    },
    [setSearchOptions],
  );

  return (
    <Combobox
      options={options}
      currentId={decisionBodyId}
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
          setSearchOptions((opts) => ({ ...opts, query: ev.target.value }))
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
