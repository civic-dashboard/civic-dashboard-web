'use client';

import { useState, useMemo } from 'react';
import { PostalCodeSearch } from '@/components/PostalCodeSearch';
import { CouncillorsList } from '@/components/CouncillorsList';
import { SearchInput } from '@/components/SearchInput';
import { Role } from '@/app/councillors/page';

export function CouncillorListContainer({
  councillors,
}: {
  councillors: Array<{
    contactSlug: string;
    photoUrl: string | null;
    contactName: string;
    wardName: string | null;
    wardId: string | null;
    role: Role;
    searchTarget: string;
  }>;
}) {
  const [wardIds, setWardIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const filteredCouncillors = useMemo(() => {
    const cleanedQuery = query.trim().toLocaleLowerCase();

    let filtered = councillors;

    if (wardIds.length > 0) {
      filtered = filtered.filter(
        (c) => c.role !== 'Mayor' && c.wardId && wardIds.includes(c.wardId),
      );
    }

    if (!cleanedQuery) return filtered;

    return filtered.filter((councillor) =>
      councillor.searchTarget.includes(cleanedQuery),
    );
  }, [councillors, query, wardIds]);

  return (
    <>
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Current Toronto Councillors & Mayor
        </h1>
        <p className="text-muted-foreground mb-6">
          Each councillor serves one ward, and all Toronto wards are listed
          below.
        </p>
        <div className="space-y-4">
          <PostalCodeSearch
            onWardsFound={setWardIds}
            onInputChange={(value) => {
              if (value.trim().length > 0) {
                setQuery('');
              }
            }}
          />
          {wardIds.length === 0 && (
            <div className="flex justify-end">
              <div className="w-full max-w-[300px]">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search councillor's name"
                  aria-label="Filter the list of councillors by name and ward"
                  searchDelay={400}
                />
              </div>
            </div>
          )}
        </div>
      </section>
      <section>
        <CouncillorsList councillors={filteredCouncillors} query={query} />
      </section>
    </>
  );
}
