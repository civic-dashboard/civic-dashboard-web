'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import {
  SubscriptionUpdateEmailProps,
  SubscriptionUpdateEmail,
} from '@/backend/emails/templates/subscriptionUpdate';
import {
  SubscribableSearchFilters,
  getSearchFiltersDescription,
} from '@/logic/search';
import { allTags } from '@/constants/tags';
import { decisionBodies } from '@/constants/decisionBodies';

type Args = {
  to: string | string[];
  props: SubscriptionUpdateEmailProps;
};

function getSubject(filters: SubscribableSearchFilters[]): string {
  if (filters.length === 0) {
    return 'New subscription results from Civic Dashboard';
  }

  const firstFilterDesc = getSearchFiltersDescription(
    filters[0],
    allTags,
    decisionBodies,
  );
  if (!firstFilterDesc) {
    return 'New subscription results from Civic Dashboard';
  }

  let subject = `Subscription results: ${firstFilterDesc}`;
  if (filters.length > 1) {
    const otherCount = filters.length - 1;
    subject += ` and ${otherCount} other subscription${
      otherCount > 1 ? 's' : ''
    }`;
  }
  subject += ' from Civic Dashboard';

  return subject;
}

export async function sendSubscriptionUpdateEmail({ to, props }: Args) {
  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject: getSubject(props.filters),
    to,
    react: <SubscriptionUpdateEmail {...props} />,
  });
}
