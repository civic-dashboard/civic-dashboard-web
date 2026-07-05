'use client';
import AgendaItemResults from '@/app/councillors/[contactSlug]/components/AgendaItemResults';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
//import { useState } from 'react';
//import { SearchInput } from '@/components/SearchInput';

export default function CouncillorVoteContent({
  contactSlug,
  currentPage,
}: {
  contactSlug: string;
  currentPage: number;
}) {
  //const [searchTerm, setSearchTerm] = useState(''); // frontend search removed with Issue #238

  return (
    <>
      {/* 
      <SearchInput
        onChange={setSearchTerm}
        aria-label="Search agenda items"
        placeholder="Search agenda items…"
        className="dark:bg-transparent"
      />
      */}
      <Suspense fallback={Spinner}>
        <AgendaItemResults
          currentPage={currentPage}
          //searchTerm={searchTerm}
          contactSlug={contactSlug}
        />
      </Suspense>
    </>
  );
}
