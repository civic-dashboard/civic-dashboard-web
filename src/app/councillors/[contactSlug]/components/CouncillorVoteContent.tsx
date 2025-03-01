'use client';
import { useState } from 'react';
import AgendaItemSearch from '@/app/councillors/[contactSlug]/components/AgendaItemSearch';
import AgendaItemResults from '@/app/councillors/[contactSlug]/components/AgendaItemResults';
import { AgendaItem } from '@/app/councillors/[contactSlug]/types';

export default function CouncillorVoteContent({
  agendaItems,
}: {
  agendaItems: AgendaItem[];
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <AgendaItemSearch onSearch={setSearchTerm} />
      <AgendaItemResults agendaItems={agendaItems} searchTerm={searchTerm} />
    </>
  );
}
