import { AgendaItem } from '@/database/queries/agendaItems';
import { Heading, Hr, Link, Section } from '@react-email/components';
import { Fragment } from 'react';
import { EmailWrapper } from '@/backend/emails/components/emailWrapper';
import { EmailSubscriptionCard } from '@/backend/emails/components/subscriptionCard';
import { EmailAgendaItemCard } from '@/backend/emails/components/agendaItemCard';
import { SubscribableSearchFilters } from '@/logic/search';
import { UnsubscribeLink } from '@/backend/emails/components/unsubscribeLink';

export type SubscriptionUpdateEmailProps = {
  unsubscribeToken: string;
  items: AgendaItem[];
  filters: SubscribableSearchFilters[];
};
export const SubscriptionUpdateEmail = ({
  unsubscribeToken,
  items,
  filters,
}: SubscriptionUpdateEmailProps) => {
  return (
    <EmailWrapper
      unsubscribeToken={unsubscribeToken}
      previewText="New subscription results."
    >
      <Heading>
        Here are some new results for your subscription on{' '}
        <Link href={process.env.HOSTNAME_FOR_EMAIL_LINKS}>Civic Dashboard</Link>
      </Heading>
      <Section>
        <Heading as="h3">
          The results matched the following subscriptions. You can{' '}
          <UnsubscribeLink unsubscribeToken={unsubscribeToken}>
            unsubscribe
          </UnsubscribeLink>{' '}
          at any time.
        </Heading>
        {filters.map((searchOption, index) => (
          <Fragment key={index}>
            {index !== 0 && <Hr style={{ borderTopColor: 'black' }} />}
            <EmailSubscriptionCard filters={searchOption} />
          </Fragment>
        ))}
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
