import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { useMemo, memo } from 'react';
import { Link2Icon } from 'lucide-react';
import { SummaryPanel } from '@/app/councillors/[contactSlug]/components/SummaryPanel';
import { MotionsList } from '@/app/councillors/[contactSlug]/components/MotionsList';
import { AgendaItemLink } from '@/components/AgendaItemLink';

const AgendaItemCard = memo(function AgendaItemCard({
  item,
}: {
  item: AgendaItem;
}) {
  return (
    <div className="flex flex-row mb-8">
      <div className="border rounded-xl w-full">
        <div className="flex justify-between border-b px-4 py-3">
          <div className="border rounded-lg px-4 py-2 text-xs text-black font-semibold bg-[#a5f2d4]">
            {formatDateString(item.motions[0].dateTime)}
          </div>
          <AgendaItemLink
            className="text-xs font-semibold flex items-center border-2 rounded-lg px-4 py-2"
            agendaItemNumber={item.agendaItemNumber}
          >
            <Link2Icon className="w-[14px] h-[14px] mr-2" />
            {item.agendaItemNumber}
          </AgendaItemLink>
        </div>
        <div className="px-4 pt-3">
          <h3 className="font-semibold text-sm">{item.agendaItemTitle}</h3>
          {item.agendaItemSummary && (
            <SummaryPanel summary={item.agendaItemSummary} />
          )}
        </div>
        <MotionsList motions={item.motions} />
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
      <div className="flex justify-end mb-8">
        <div>{filteredItems.length} results</div>
      </div>

      <div>
        {filteredItems.map((item) => (
          <AgendaItemCard key={item.agendaItemNumber} item={item} />
        ))}
      </div>
    </div>
  );
}

const formatDateString = (dateString: string) => {
  if (!dateString) return dateString;
  const date = new Date(dateString.substring(0, 10));
  if (!date.getTime()) return dateString;
  date.setMinutes(date.getTimezoneOffset());
  return dateFormatter.format(date);
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
