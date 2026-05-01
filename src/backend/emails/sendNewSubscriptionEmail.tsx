'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import {
  NewSubscriptionEmail,
  NewSubscriptionEmailProps,
} from '@/backend/emails/templates/newSubscription';
import { getSearchFiltersDescription } from '@/logic/search';
import { allTags } from '@/constants/tags';
import { decisionBodies } from '@/constants/decisionBodies';

type Args = {
  to: string | string[];
  props: NewSubscriptionEmailProps;
};
export async function sendNewSubscriptionEmail({ to, props }: Args) {
  const filterDesc = getSearchFiltersDescription(
    props.filters,
    allTags,
    decisionBodies,
  );
  const subject = filterDesc
    ? `New subscription: ${filterDesc} on Civic Dashboard`
    : 'New subscription on Civic Dashboard';

  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject,
    to,
    react: <NewSubscriptionEmail {...props} />,
  });
}
