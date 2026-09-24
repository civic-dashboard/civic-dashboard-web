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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, type ButtonProps } from '@/components/ui/button';

type Option<ID extends number | string> = {
  id: ID;
  label: string;
};

type Props<ID extends number | string> = {
  options: Option<ID>[];
  onSelect: NoInfer<(id: ID) => void>;
  buttonVariant: NonNullable<ButtonProps['variant']>;
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
  staticLabel?: string;
  onClear?: () => void;
  mobileSheetTitle?: string;
};

// TODO: how to dynamically/responsively size this?
export const Combobox = <ID extends number | string>({
  options,
  onSelect,
  buttonVariant,
  multiple,
  value,
  placeholder,
  noResults,
  searchable = true,
  reorderSelected = true,
  resetScrollOnSearch = false,
  defaultValue = undefined,
  staticLabel,
  onClear,
  mobileSheetTitle,
}: Props<ID>) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const commandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileSheetTitle) return;

    const query = window.matchMedia('(max-width: 639px)');
    const update = () => {
      setIsMobile(query.matches);
      setOpen(false);
    };

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [mobileSheetTitle]);

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

  const isEmpty = useMemo(
    () => (Array.isArray(value) && value.length === 0) || value === undefined,
    [value],
  );

  const displayedValue = useMemo(() => {
    if (staticLabel) return staticLabel;
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
  }, [defaultValue, optionMap, placeholder, staticLabel, value]);

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

  const trigger = (className?: string) => (
    <Button
      variant={buttonVariant}
      role="combobox"
      aria-expanded={open}
      aria-label={
        staticLabel && !isEmpty && Array.isArray(value)
          ? `${staticLabel}: ${value.length} selected`
          : undefined
      }
      className={cn('gap-1 max-w-[300px]', className)}
    >
      <span className="relative">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {displayedValue}
        </span>
        {staticLabel && Array.isArray(value) && !isEmpty && (
          <span
            aria-hidden
            className="-top-2 -right-3 absolute flex justify-center items-center bg-green-700 px-1 rounded-full min-w-[14px] h-[14px] font-bold text-[10px] text-white leading-none"
          >
            {value.length}
          </span>
        )}
      </span>
      <ChevronDown className="w-4 h-4 shrink-0" />
    </Button>
  );

  const menu = () => (
    <Command>
      {searchable && (
        <CommandInput
          placeholder={placeholder}
          onValueChange={resetScrollOnSearch ? onSearchValueChange : undefined}
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
      {onClear && !isEmpty && (
        <div className="flex justify-end p-2">
          <Button
            variant="outline"
            size="sm"
            className="p-1 w-full h-auto"
            onClick={onClear}
          >
            Clear selection
          </Button>
        </div>
      )}
    </Command>
  );

  if (mobileSheetTitle && isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger()}</DialogTrigger>
        <DialogContent bottomSheet>
          <DialogHeader className="border-gray-light border-b text-left">
            <DialogTitle>{mobileSheetTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-2 min-h-0 overflow-y-auto">{menu()}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger()}</PopoverTrigger>
      <PopoverContent className="p-0 max-w-[500px]">{menu()}</PopoverContent>
    </Popover>
  );
};
