'use client';
import { useState } from 'react';
import AgendaItemResults from '@/app/councillors/[contactSlug]/components/AgendaItemResults';
import { SearchInput } from '@/components/SearchInput';

export default function CouncillorVoteContent({
  contactSlug,
  currentPage,
}: {
  contactSlug: string;
  currentPage: number;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <SearchInput
        onChange={setSearchTerm}
        aria-label="Search agenda items"
        placeholder="Search agenda items…"
        className="dark:bg-transparent"
      />
      <AgendaItemResults
        currentPage={currentPage}
        searchTerm={searchTerm}
        contactSlug={contactSlug}
      />
    </>
  );
}
