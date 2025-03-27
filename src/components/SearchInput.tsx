import { Input } from '@/components/ui/input';
import { debounce } from '@/logic/debounce';
import React, { useCallback, useEffect, useMemo } from 'react';

type InputProps = JSX.IntrinsicElements['input'];
export type SearchInputProps = Omit<
  InputProps,
  'onChange' | 'onBlur' | 'onKeyDown'
> & {
  onChange: (value: string) => void;
  searchDelay?: number;
};

export const SearchInput = ({
  onChange,
  searchDelay = 500,
  ...unmodifiedProps
}: SearchInputProps) => {
  const triggerOnChange = useMemo(
    () => debounce(onChange, searchDelay),
    [onChange, searchDelay],
  );

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter')
        triggerOnChange.immediate(event.currentTarget.value);
    },
    [triggerOnChange],
  );
  useEffect(() => triggerOnChange.cancel, [triggerOnChange]);
  return (
    <Input
      {...unmodifiedProps}
      onChange={(e) => {
        const value = e.currentTarget.value;
        if (value) triggerOnChange.debounced(value);
        else triggerOnChange.immediate('');
      }}
      onBlur={(e) => triggerOnChange.immediate(e.currentTarget.value)}
      onKeyDown={handleOnKeyDown}
    />
  );
};
