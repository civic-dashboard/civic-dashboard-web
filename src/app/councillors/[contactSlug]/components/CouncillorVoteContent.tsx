'use client';
import { useState } from 'react';
import AgendaItemResults from '@/app/councillors/[contactSlug]/components/AgendaItemResults';
import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { SearchInput } from '@/components/SearchInput';

export default function CouncillorVoteContent({
  agendaItems,
  contactSlug,
  currentPage,
  itemCount,
}: {
  agendaItems: AgendaItem[];
  contactSlug: string;
  currentPage: number;
  itemCount: number;
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
        agendaItems={agendaItems}
        itemCount={itemCount}
        searchTerm={searchTerm}
        contactSlug={contactSlug}
      />
    </>
  );
}
