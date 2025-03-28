import { AgendaItem } from '@/database/queries/agendaItems';
import { Heading, Section, Text } from '@react-email/components';

export const EmailAgendaItemCard = ({ item }: { item: AgendaItem }) => {
  return (
    <Section style={{ padding: '16px' }}>
      <Heading as="h2">
        {item.reference}: {item.agendaItemTitle}
      </Heading>
      <Text
        style={{ fontSize: '16px' }}
        dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
      />
    </Section>
  );
};
