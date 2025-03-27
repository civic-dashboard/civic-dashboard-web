import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { useMemo, memo } from 'react';

import { SummaryPanel } from '@/app/councillors/[contactSlug]/components/SummaryPanel';
import { Link2 } from 'lucide-react';

const AgendaItemCard = memo(function AgendaItemCard({
  item,
}: {
  item: AgendaItem;
}) {
  const getVoteIcon = (value: string) => {
    switch (value?.toLowerCase()) {
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

  return (
    <div className="flex flex-row mb-8">
      <div className="border rounded-xl w-full">
        <div className="flex justify-between border-b px-4 py-3">
          <div className="border rounded-lg px-4 py-2 text-xs text-black font-semibold bg-[#a5f2d4]">
            {formatDateString(item.motions[0].dateTime)}
          </div>
          <div className="text-xs font-semibold flex items-center border-2 rounded-lg px-4 py-2 font-semibold">
            <Link2 className="w-[14px] h-[14px] mr-2" />
            {item.agendaItemNumber}
          </div>
        </div>
        <div className="px-4 py-3">
          <h3 className="font-semibold text-sm mb-2">{item.agendaItemTitle}</h3>
          {item.agendaItemSummary && (
            <SummaryPanel summary={item.agendaItemSummary} />
          )}
        </div>
        {/* Motions List */}
        <div className="space-y-4 mt-4">
          {item.motions.map((motion) => (
            <div key={motion.motionId} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm">
                  <span className="text-black">Date</span>{' '}
                  <span className="text-gray-500">{motion.dateTime}</span>
                </div>
                <div className="text-sm font-medium">
                  <span className="text-black">Motion</span>{' '}
                  <span className="text-gray-500">{motion.motionType}</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  Status
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-black text-sm">
                    {motion.resultKind === 'Carried' ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  Vote
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-black text-sm">
                    {getVoteIcon(motion.value)}
                  </span>
                </div>
                <div className="text-sm">{motion.voteDescription}</div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="border w-fit px-2 py-1 rounded-md font-medium mt-4">
          {item.agendaItemNumber}
        </div> */}
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
            key={`${item.agendaItemNumber}-${item.motions[0]?.motionId}`}
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
