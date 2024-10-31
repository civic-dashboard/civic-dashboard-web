import { DecisionBody } from '@/api/decisionbody';
import { AgendaItem } from '@/api/item';

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

export function ItemCard({ item, decisionBody }: Props) {
  const formattedDate = new Date(item.meetingDate).toLocaleDateString();
  const commentsHref = `mailto:${decisionBody.email}?subject=My comments for ${item.reference}&body=My comments`;
  const requestHref = `mailto:${decisionBody.email}?subject=Request to appear before ${item.decisionBodyName} on item ${item.reference}&body=Request to appear`;

  return (
    <div className="bg-white shadow-md p-4">
      <h2>{item.agendaItemTitle}</h2>
      <div className="flex flex-row space-x-2 mb-2">
        <EngagementButton text="Submit Comments" href={commentsHref} />
        <EngagementButton text="Request to Speak" href={requestHref} />
      </div>
      <p className="text-gray-600 mb-1">
        <strong>Decision Body:</strong> {item.decisionBodyName}
      </p>
      <p className="text-gray-600 mb-1">
        <strong>Meeting Date:</strong> {formattedDate}
      </p>
      <p className="text-gray-600 mb-1">
        <strong>Status:</strong> {item.itemStatus}
      </p>
      <div
        className="text-gray-800 mt-2"
        dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
      />
    </div>
  );
}
