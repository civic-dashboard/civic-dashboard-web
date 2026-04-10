'use client';

import { Role } from '@/app/councillors/page';
import { Avatar } from '@/components/Avatar';
import { cn } from '@/components/ui/utils';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

export const CouncillorsList = ({
  councillors,
  query = '',
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
  query?: string;
}) => {
  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {councillors.map((councillor) => (
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
                <p>
                  {councillor.role === 'Councillor' && councillor.wardName}
                  {councillor.role === 'Mayor' && 'Mayor of Toronto'}
                </p>
              </div>
              <div className="ml-auto">
                <ChevronRightIcon />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {councillors.length === 0 && (
        <p>No councillors found {query ? `for "${query}"` : ''}</p>
      )}
    </>
  );
};
