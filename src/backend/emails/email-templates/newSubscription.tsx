import { AgendaItem } from '@/database/queries/agendaItems';
import { CoreSearchOptions } from '@/logic/search';
import { Heading, Hr, Section } from '@react-email/components';
import { Fragment } from 'react';
import { EmailWrapper } from '@/backend/emails/email-templates/emailWrapper';
import { EmailSubscriptionCard } from '@/backend/emails/email-templates/subscriptionCard';
import { EmailAgendaItemCard } from '@/backend/emails/email-templates/agendaItemCard';

export type NewSubscriptionEmailProps = {
  items: AgendaItem[];
  searchOptions: CoreSearchOptions;
};
export const NewSubscriptionEmail = ({
  items,
  searchOptions,
}: NewSubscriptionEmailProps) => {
  return (
    <EmailWrapper previewText="New search subscription on Civic Dashboard.">
      <Heading>
        This email has been subscribed to search results on Civic Dashboard.
      </Heading>
      The emails you receive will look like this, and you can unsubscribe at any
      time.
      <Section>
        <EmailSubscriptionCard searchOptions={searchOptions} />
      </Section>
      {items.map((item, index) => (
        <Fragment key={item.agendaItemId}>
          {index !== 0 && <Hr style={{ borderTopColor: 'black' }} />}
          <EmailAgendaItemCard item={item} />
        </Fragment>
      ))}
    </EmailWrapper>
  );
};
