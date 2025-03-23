import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { useMemo, memo } from 'react';

import { SummaryPanel } from '@/app/councillors/[contactSlug]/components/SummaryPanel';

const AgendaItemCard = memo(function AgendaItemCard({
  item,
}: {
  item: AgendaItem;
}) {
  const getVoteIcon = (value: string) => {
    switch (value.toLowerCase()) {
      case 'yes':
        return '✓';
      case 'no':
        return '✗';
      case 'absent':
        return 'ab';
      default:
        return '-';
    }
  };

  const formatAgendaNumber = (number: string) => {
    return number.split('.').slice(1).join('.');
  };

  return (
    <div className="flex flex-row mb-4">
      <div className="text-sm text-gray-500 mb-2 min-w-20 text-right pr-4">
        {formatDateString(item.dateTime)}
      </div>
      <div className="pl-4 border-l-4 border-indigo-700">
        <h3 className="font-semibold mb-2">{item.agendaItemTitle}</h3>
        {item.agendaItemSummary && (
          <SummaryPanel summary={item.agendaItemSummary} />
        )}
        <div className="flex flex-row text-md gap-4 mb-2">
          <div className="flex items-center gap-2">
            Carried
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-black text-xl">
              {item.resultKind === 'Carried' ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            Vote
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-black text-xl">
              {getVoteIcon(item.value)}
            </span>
          </div>
        </div>
        <div className="border w-fit px-2 py-1 rounded-md font-medium">
          {formatAgendaNumber(item.agendaItemNumber)}
        </div>
      </div>
    </div>
  );
});

export default function AgendaItemResults({
  agendaItems,
  searchTerm = '',
}: {
  agendaItems: AgendaItem[];
  searchTerm?: string;
}) {
  const tidySearchQuery = searchTerm.toLocaleLowerCase().trim();
  const filteredItems = useMemo(
    () =>
      tidySearchQuery
        ? agendaItems.filter((item) =>
            item.agendaItemTitle.toLowerCase().includes(tidySearchQuery),
          )
        : agendaItems,
    [agendaItems, tidySearchQuery],
  );

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div>{filteredItems.length} results</div>
      </div>

      <div>
        {filteredItems.map((item) => (
          <AgendaItemCard
            key={`${item.agendaItemNumber}-${item.motionId}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

const formatDateString = (dateString: string) => {
  if (!dateString) return dateString;
  const date = new Date(dateString);
  if (!date.getTime()) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
