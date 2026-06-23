import { AgendaItem } from '@/database/queries/agendaItems';
import { stripHtmlAndGetFirstParagraph } from '@/logic/sanitize';
import { formatAgendaItemStatus } from '@/logic/strings';
import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from '@react-email/components';

const SUMMARY_MAX_CHARS = 200;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  day: 'numeric',
  timeZone: 'America/Toronto',
});

export const EmailAgendaItemCard = ({ item }: { item: AgendaItem }) => {
  const formattedDate = dateFormatter
    .format(new Date(item.meetingDate))
    .replace(',', '');
  const formattedStatus = formatAgendaItemStatus(item.itemStatus);
  const plainSummary = stripHtmlAndGetFirstParagraph(item.agendaItemSummary);
  const summary =
    plainSummary.length > SUMMARY_MAX_CHARS
      ? plainSummary.slice(0, SUMMARY_MAX_CHARS) + '...'
      : plainSummary;
  const itemUrl = `${process.env.HOSTNAME_FOR_EMAIL_LINKS}/actions/item/${item.reference}`;

  return (
    <Section style={card}>
      <Text style={meta}>
        {formattedDate} · {item.decisionBodyName}
      </Text>
      <Heading as="h2" style={heading}>
        <Link href={itemUrl} style={titleLink}>
          {item.reference}: {item.agendaItemTitle}
        </Link>
      </Heading>
      {formattedStatus && (
        <Text style={statusBadge}>Status: {formattedStatus}</Text>
      )}
      <Hr style={divider} />
      <Text style={body}>{summary}</Text>
      <Button href={itemUrl} style={readMore}>
        Read more →
      </Button>
    </Section>
  );
};

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  borderTop: '1px solid #e5e7eb',
  borderRight: '1px solid #e5e7eb',
  borderBottom: '1px solid #e5e7eb',
  borderLeft: '4px solid #4f46e5',
  padding: '24px',
  margin: '16px 0',
};
const meta = { color: '#6b7280', fontSize: '13px', margin: '0 0 8px 0' };
const heading = { margin: '0 0 12px 0' };
const titleLink = { color: '#1d4ed8', textDecoration: 'none' };
const statusBadge = {
  backgroundColor: '#f3f4f6',
  color: '#374151',
  fontSize: '13px',
  padding: '4px 10px',
  borderRadius: '4px',
  margin: '0 0 4px 0',
};
const divider = { borderTopColor: '#e5e7eb', margin: '16px 0' };
const body = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 16px 0',
};
const readMore = {
  backgroundColor: '#4f46e5',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  padding: '10px 20px',
  textDecoration: 'none',
};
