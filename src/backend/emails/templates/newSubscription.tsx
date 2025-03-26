import { AgendaItem } from '@/database/queries/agendaItems';
import { SubscribableSearchFilters } from '@/logic/search';
import { Heading, Hr, Link, Section } from '@react-email/components';
import { Fragment } from 'react';
import { EmailWrapper } from '@/backend/emails/components/emailWrapper';
import { EmailSubscriptionCard } from '@/backend/emails/components/subscriptionCard';
import { EmailAgendaItemCard } from '@/backend/emails/components/agendaItemCard';
import { UnsubscribeLink } from '@/backend/emails/components/unsubscribeLink';

export type NewSubscriptionEmailProps = {
  unsubscribeToken: string;
  items: AgendaItem[];
  filters: SubscribableSearchFilters;
};
export const NewSubscriptionEmail = ({
  unsubscribeToken,
  items,
  filters,
}: NewSubscriptionEmailProps) => {
  return (
    <EmailWrapper
      unsubscribeToken={unsubscribeToken}
      previewText="New search subscription on Civic Dashboard."
    >
      <Heading>
        This email has been subscribed to search results on{' '}
        <Link href={process.env.HOSTNAME_FOR_EMAIL_LINKS}>Civic Dashboard</Link>
        .
      </Heading>
      You can{' '}
      <UnsubscribeLink unsubscribeToken={unsubscribeToken}>
        unsubscribe
      </UnsubscribeLink>{' '}
      at any time.
      {items.length > 0 ? ' The emails you receive will look like this:' : ''}
      <Hr />
      <Section>
        <EmailSubscriptionCard filters={filters} />
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
