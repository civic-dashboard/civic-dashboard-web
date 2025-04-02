import { AgendaItem } from '@/database/queries/agendaItems';
import { Heading, Link, Section, Text } from '@react-email/components';

export const EmailAgendaItemCard = ({ item }: { item: AgendaItem }) => {
  return (
    <Section style={{ padding: '16px' }}>
      <Heading as="h2">
        <Link
          href={`${process.env.HOSTNAME_FOR_EMAIL_LINKS}/actions/item/${item.reference}`}
        >
          {item.reference}: {item.agendaItemTitle}
        </Link>
      </Heading>
      <Text
        style={{ fontSize: '16px' }}
        dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
      />
    </Section>
  );
};
