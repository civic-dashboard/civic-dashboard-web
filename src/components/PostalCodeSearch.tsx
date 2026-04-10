'use client';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '@/logic/debounce';

export function PostalCodeSearch({
  onWardsFound,
  onInputChange,
}: {
  onWardsFound: (wardIds: string[]) => void;
  onInputChange?: (value: string) => void;
}) {
  const [postalCode, setPostalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWards = useCallback(
    async (pc: string) => {
      const cleaned = pc.trim().replace(/\s+/g, '').toLowerCase();
      if (cleaned.length < 5) {
        onWardsFound([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/postal-code-wards?postalCode=${encodeURIComponent(cleaned)}`,
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const wardIds = data.wardIds || [];
        onWardsFound(wardIds);

        if (wardIds.length === 0 && cleaned.length >= 5) {
          setError('No Toronto wards found for this postal code.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to lookup postal code');
        onWardsFound([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onWardsFound],
  );

  const debouncedFetchWards = useMemo(
    () => debounce(fetchWards, 400),
    [fetchWards],
  );

  useEffect(() => {
    const cleaned = postalCode.trim().replace(/\s+/g, '');
    if (cleaned.length >= 5) {
      debouncedFetchWards.debounced(cleaned);
    } else {
      debouncedFetchWards.cancel();
      setError(null);
      onWardsFound([]);
    }
    return debouncedFetchWards.cancel;
  }, [postalCode, debouncedFetchWards, onWardsFound]);

  return (
    <div className="bg-muted/50 p-4 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-2">Find Your Councillor</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Enter your postal code (at least 5 characters) to filter councillors by
        ward.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <Input
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
              onInputChange?.(e.target.value);
            }}
            placeholder="M2N 7H5"
            className="max-w-[180px]"
            aria-label="Postal Code"
            maxLength={7}
          />
          {isLoading && <Spinner size="small" />}
        </div>
        {error && (
          <p className="text-destructive text-sm font-medium mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}
