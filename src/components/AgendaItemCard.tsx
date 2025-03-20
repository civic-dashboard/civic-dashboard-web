import { DecisionBody } from '@/api/decisionBody';
import { HighlightChildren } from '@/components/ui/highlightChildren';
import { Card } from '@/components/ui/card';
import type { AgendaItem } from '@/database/queries/agendaItems';
import { useSearch } from '@/contexts/SearchContext';

type EngagementButtonProps = {
  text: string;
  href: string;
};
function EngagementButton({ text, href }: EngagementButtonProps) {
  return (
    <a className="p-1 px-3 bg-sky-700 rounded-md text-white" href={href}>
      {text}
    </a>
  );
}

type Props = {
  item: AgendaItem;
  decisionBody: DecisionBody;
};

export function AgendaItemCard({ item, decisionBody }: Props) {
  const {
    searchOptions: { textQuery },
  } = useSearch();
  const formattedDate = new Date(item.meetingDate).toLocaleDateString();
  const commentsHref = `mailto:${decisionBody.email}?subject=My comments for ${item.reference}&body=My comments`;
  const requestHref = `mailto:${decisionBody.email}?subject=Request to appear before ${item.decisionBodyName} on item ${item.reference}&body=Request to appear`;

  return (
    <Card className="p-4">
      <HighlightChildren element="h2" terms={textQuery}>
        {item.agendaItemTitle}
      </HighlightChildren>
      <div className="flex flex-row space-x-2 mb-2">
        <EngagementButton text="Submit Comments" href={commentsHref} />
        <EngagementButton text="Request to Speak" href={requestHref} />
      </div>
      <p className="mb-1">
        <strong>Decision Body:</strong>{' '}
        <HighlightChildren terms={textQuery} element="span">
          {item.decisionBodyName}
        </HighlightChildren>
      </p>
      <p className="mb-1">
        <strong>Meeting Date:</strong> {formattedDate}
      </p>
      {/* <p className="text-gray-600 mb-1">
        <strong>Status:</strong> {item.itemStatus}
      </p> */}
      <HighlightChildren terms={textQuery}>
        <div
          className=" mt-2"
          dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
        />
      </HighlightChildren>
    </Card>
  );
}
