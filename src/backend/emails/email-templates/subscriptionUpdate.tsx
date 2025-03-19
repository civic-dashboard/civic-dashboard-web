import { AgendaItem } from '@/database/queries/agendaItems';
import { CoreSearchOptions } from '@/logic/search';
import { Heading, Hr, Section } from '@react-email/components';
import { Fragment } from 'react';
import { EmailWrapper } from '@/backend/emails/email-templates/emailWrapper';
import { EmailSubscriptionCard } from '@/backend/emails/email-templates/subscriptionCard';
import { EmailAgendaItemCard } from '@/backend/emails/email-templates/agendaItemCard';

export type SubscriptionUpdateEmailProps = {
  items: AgendaItem[];
  searchOptions: CoreSearchOptions[];
};
export const SubscriptionUpdateEmail = ({
  items,
  searchOptions,
}: SubscriptionUpdateEmailProps) => {
  return (
    <EmailWrapper previewText="New subscription results.">
      <Heading>
        Here are some new results for your subscription on Civic Dashboard
      </Heading>
      <Section>
        <Heading>The results matched the following subscriptions.</Heading>
        {searchOptions.map((searchOption, index) => (
          <Fragment key={index}>
            {index !== 0 && <Hr style={{ borderTopColor: 'black' }} />}
            <EmailSubscriptionCard searchOptions={searchOption} />
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
