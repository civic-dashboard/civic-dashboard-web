import { Input } from '@/components/ui/input';
import { debounce } from '@/logic/debounce';
import React, { useCallback, useEffect, useMemo } from 'react';

type InputProps = JSX.IntrinsicElements['input'];
export type SearchInputProps = Omit<
  InputProps,
  'onChange' | 'onBlur' | 'onKeyDown'
> & {
  value?: string;
  onChange: (value: string) => void;
  searchDelay?: number;
};

export const SearchInput = ({
  value: propValue,
  onChange,
  searchDelay = 500,
  ...unmodifiedProps
}: SearchInputProps) => {
  const [localValue, setLocalValue] = React.useState(propValue || '');
  const prevPropValueRef = React.useRef(propValue);

  const triggerOnChange = useMemo(
    () => debounce(onChange, searchDelay),
    [onChange, searchDelay],
  );

  // Update local value if prop value changes from outside
  useEffect(() => {
    if (propValue !== prevPropValueRef.current) {
      setLocalValue(propValue || '');
      triggerOnChange.cancel();
      prevPropValueRef.current = propValue;
    }
  }, [propValue, triggerOnChange]);

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter')
        triggerOnChange.immediate(event.currentTarget.value);
    },
    // In this case we only care about the callback reference, not it's parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerOnChange.immediate],
  );

  useEffect(() => triggerOnChange.cancel, [triggerOnChange]);

  return (
    <Input
      {...unmodifiedProps}
      value={localValue}
      onChange={(e) => {
        const value = e.currentTarget.value;
        setLocalValue(value);
        if (value) triggerOnChange.debounced(value);
        else triggerOnChange.immediate('');
      }}
      onBlur={(e) => triggerOnChange.immediate(e.currentTarget.value)}
      onKeyDown={handleOnKeyDown}
    />
  );
};
