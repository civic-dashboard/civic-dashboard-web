import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import clsx from 'clsx';

type Option = {
  id: string;
  label: string;
};

type Props = {
  options: Option[];
  onSelect: (id: string) => void;
  currentId?: string;
  placeholder?: string;
  noResults?: string;
};

// TODO: how to dynamically/responsively size this?
export const Combobox = ({
  options,
  onSelect,
  currentId,
  placeholder,
  noResults,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx(
            'w-[500px] justify-between',
            !currentId && 'text-gray-500'
          )}
        >
          {currentId
            ? options.find(({ id }) => id === currentId)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            {noResults && <CommandEmpty>{noResults}</CommandEmpty>}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  onSelect={() => onSelect(option.id)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      option.id === currentId ? 'opacity-100' : 'opacity-0'
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
