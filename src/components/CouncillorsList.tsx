'use client';

import { Avatar } from '@/components/Avatar';
import { SearchInput } from '@/components/SearchInput';
import { cn } from '@/components/ui/utils';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { useMemo, useState } from 'react';

export const CouncillorsList = ({
  councillors,
}: {
  councillors: Array<{
    contactSlug: string;
    photoUrl: string | null;
    contactName: string;
    wardName: string;
    searchTarget: string;
  }>;
}) => {
  const [query, setQuery] = useState('');
  const filteredCouncillors = useMemo(() => {
    const cleanedQuery = query.trim().toLocaleLowerCase();
    if (!cleanedQuery) return councillors;
    return councillors.filter((councillor) =>
      councillor.searchTarget.includes(cleanedQuery),
    );
  }, [councillors, query]);
  return (
    <>
      <header className="flex justify-between flex-col md:flex-row gap-5 mb-3 md:items-center">
        <h2 className="whitespace-nowrap mb-0">Current Toronto Councillors</h2>
        <SearchInput
          onChange={setQuery}
          placeholder="Search councillors"
          aria-label="Filter the list of councillors by name and ward"
          searchDelay={500}
        />
      </header>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none ml-0">
        {filteredCouncillors.map((councillor) => (
          <li
            key={councillor.contactSlug}
            className={cn(
              'border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950  dark:text-slate-50 rounded-md',
              'max-md:even:bg-slate-50 max-md:even:dark:bg-slate-900',
            )}
          >
            <Link
              href={`/councillors/${councillor.contactSlug}`}
              className="p-2 flex gap-2 hover:underline items-center"
              prefetch={false}
            >
              <Avatar src={councillor.photoUrl} size={52} />
              <div>
                <h3 className="text-lg">{councillor.contactName}</h3>
                <p>{councillor.wardName}</p>
              </div>
              <div className="ml-auto">
                <ChevronRightIcon />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {filteredCouncillors.length === 0 && (
        <p>No councillors found for {`"${query}"`}</p>
      )}
    </>
  );
};
