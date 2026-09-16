import { Check, ChevronDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/components/ui/utils';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button, type ButtonProps } from '@/components/ui/button';

type Option<ID extends number | string> = {
  id: ID;
  label: string;
};

type Props<ID extends number | string> = {
  options: Option<ID>[];
  onSelect: NoInfer<(id: ID) => void>;
  multiple: boolean;
  value?: ID | ID[];
  placeholder?: string;
  noResults?: string;
  /** Hides search bar if false */
  searchable?: boolean;
  /** Keeps original order if false. Otherwise, reorders the items in the combo box based on selection */
  reorderSelected?: boolean;
  /** Scroll the dropdown list to the top when the search query changes - this is useful to keep the searched item in view */
  resetScrollOnSearch?: boolean;
  defaultValue?: ID | ID[];
  size?: ButtonProps['size'];
};

// TODO: how to dynamically/responsively size this?
export const Combobox = <ID extends number | string>({
  options,
  onSelect,
  multiple,
  value,
  placeholder,
  noResults,
  searchable = true,
  reorderSelected = true,
  resetScrollOnSearch = false,
  defaultValue = undefined,
  size,
}: Props<ID>) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const commandListRef = useRef<HTMLDivElement>(null);

  const scrollListToTop = useCallback(() => {
    const list = commandListRef.current;
    if (list) list.scrollTop = 0;
  }, []);

  useLayoutEffect(() => {
    if (resetScrollOnSearch) scrollListToTop();
  }, [searchQuery, resetScrollOnSearch, scrollListToTop]);

  const onSearchValueChange = useCallback(
    (value: string) => {
      if (!resetScrollOnSearch) return;
      scrollListToTop();
      setSearchQuery(value);
    },
    [resetScrollOnSearch, scrollListToTop],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) setSearchQuery('');
    },
    [setOpen, setSearchQuery],
  );

  if (multiple && !Array.isArray(value)) {
    throw new Error(
      'Must pass list of strings for value if using multiple option on combobox.',
    );
  } else if (!multiple && Array.isArray(value)) {
    throw new Error(
      'Must pass string or undefined for value if not using multiple option on combobox.',
    );
  }

  const optionMap = useMemo(
    () => Object.fromEntries(options.map((opt) => [opt.id, opt])),
    [options],
  );

  const displayedValue = useMemo(() => {
    if (Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      return value.map((id) => optionMap[id].label).join(', ');
    }
    if (value === undefined) {
      if (defaultValue !== undefined) {
        if (Array.isArray(defaultValue)) {
          return defaultValue
            .map((id) => optionMap[id]?.label ?? '')
            .join(', ');
        }
        return optionMap[defaultValue]?.label ?? placeholder;
      }
      return placeholder;
    }
    return optionMap[value].label;
  }, [defaultValue, optionMap, placeholder, value]);

  const isValueSelected = useCallback(
    (id: ID) => {
      if (Array.isArray(value)) return value.includes(id);
      return value === id;
    },
    [value],
  );

  const orderedOptions = useMemo(
    () =>
      reorderSelected
        ? [
            ...options.filter((opt) => isValueSelected(opt.id)),
            ...options.filter((opt) => !isValueSelected(opt.id)),
          ]
        : options,
    [options, isValueSelected, reorderSelected],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          role="combobox"
          aria-expanded={open}
          className="gap-1 max-w-[300px]"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {displayedValue}
          </span>
          {open ? (
            <ChevronDown className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-w-[500px]">
        <Command>
          {searchable && (
            <CommandInput
              placeholder={placeholder}
              onValueChange={
                resetScrollOnSearch ? onSearchValueChange : undefined
              }
            />
          )}
          <CommandList ref={commandListRef}>
            {noResults && <CommandEmpty>{noResults}</CommandEmpty>}
            <CommandGroup>
              {orderedOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  onSelect={() => onSelect(option.id)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      isValueSelected(option.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
