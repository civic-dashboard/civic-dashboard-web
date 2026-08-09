'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import {
  NewSubscriptionEmail,
  NewSubscriptionEmailProps,
} from '@/backend/emails/templates/newSubscription';
import { getSearchFiltersDescription } from '@/logic/search';
import { allTags } from '@/constants/tags';
import { createDB } from '@/database/kyselyDb';
import { getAllDecisionBodies } from '@/database/queries/decisionBodies';

type Args = {
  to: string | string[];
  props: Omit<NewSubscriptionEmailProps, 'decisionBodies'>;
};
export async function sendNewSubscriptionEmail({ to, props }: Args) {
  const decisionBodies = await getAllDecisionBodies(createDB());
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
    react: <NewSubscriptionEmail {...props} decisionBodies={decisionBodies} />,
  });
}
