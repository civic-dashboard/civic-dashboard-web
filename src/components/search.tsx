import { AgendaItem } from '@/api/agendaItem';
import { Search } from 'lucide-react';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { DecisionBody } from '@/api/decisionBody';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import {
  createSearchIndex,
  SearchOptions,
  TaggedAgendaItem,
  tags,
} from '@/logic/search';

type SearchContext = {
  searchOptions: SearchOptions;
  setSearchOptions: Dispatch<SetStateAction<SearchOptions>>;
  searchResults: TaggedAgendaItem[];
};

const SearchContext = createContext<SearchContext | null>(null);

type Props = React.PropsWithChildren<{
  items: AgendaItem[];
}>;
export function SearchProvider({ children, items }: Props) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    tags: [],
  });

  const searchIndex = useMemo(() => createSearchIndex(items), [items]);

  const searchResults = useMemo(
    () => searchIndex(searchOptions),
    [searchOptions, searchIndex],
  );

  return (
    <SearchContext.Provider
      value={{ searchOptions, setSearchOptions, searchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  return useContext(SearchContext)!;
};

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

function Tag({ tag }: { tag: string }) {
  const { searchOptions, setSearchOptions } = useSearch();
  const isSelected = useMemo(
    () => searchOptions.tags.includes(tag),
    [searchOptions.tags, tag],
  );

  const onClick = useCallback(() => {
    setSearchOptions((opts) => {
      const newTags = opts.tags.includes(tag)
        ? opts.tags.filter((t) => t !== tag)
        : [...opts.tags, tag];

      return { ...opts, tags: newTags };
    });
  }, [tag, setSearchOptions]);

  return (
    <Badge variant={isSelected ? 'default' : 'secondary'} onClick={onClick}>
      {tag}
    </Badge>
  );
}
export function Tags() {
  return (
    <div className="flex flex-row flex-wrap space-x-2 space-y-2 items-end">
      {Object.keys(tags).map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
}

export function SearchBar() {
  const { setSearchOptions } = useSearch();

  return (
    <div className="flex flex-row flex-1 space-x-2 items-center">
      <Search />
      <input
        className="p-1 flex-1"
        onChange={(ev) =>
          setSearchOptions((opts) => ({ ...opts, query: ev.target.value }))
        }
        placeholder="Search agenda items..."
      />
    </div>
  );
}
