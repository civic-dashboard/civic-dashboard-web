import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/components/ui/utils';
import { useCallback, useMemo, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cpSync } from 'fs';

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
  searchable?: boolean;
  reorderSelected?: boolean;
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
}: Props<ID>) => {
  const [open, setOpen] = useState(false);
  console.log(searchable)
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

  const isEmpty = useMemo(
    () => (Array.isArray(value) && value.length === 0) || value === undefined,
    [value],
  );

  const displayedValue = useMemo(() => {
    if (Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      return value.map((id) => optionMap[id].label).join(', ');
    }
    if (value === undefined) return placeholder;
    return optionMap[value].label;
  }, [optionMap, placeholder, value]);

  const isValueSelected = useCallback(
    (id: ID) => {
      if (Array.isArray(value)) return value.includes(id);
      return value === id;
    },
    [value],
  );

  const orderedOptions = useMemo(
    () => 
      reorderSelected ? 
    [
      ...options.filter((opt) => isValueSelected(opt.id)),
      ...options.filter((opt) => !isValueSelected(opt.id)),
    ] 
    : options,
    [options, isValueSelected, reorderSelected],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'max-w-[300px] justify-between border-neutral-200 rounded-md',
            isEmpty && 'text-gray-500',
          )}
        >
          <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
            {displayedValue}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[500px] p-0">
        <Command>
          {searchable && <CommandInput placeholder={placeholder} />}
          <CommandList>
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
