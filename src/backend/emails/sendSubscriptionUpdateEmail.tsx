'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import {
  SubscriptionUpdateEmailProps,
  SubscriptionUpdateEmail,
} from '@/backend/emails/templates/subscriptionUpdate';

type Args = {
  to: string | string[];
  props: SubscriptionUpdateEmailProps;
};
export async function sendSubscriptionUpdateEmail({ to, props }: Args) {
  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject: 'New search subscription results from Civic Dashboard',
    to,
    react: <SubscriptionUpdateEmail {...props} />,
  });
}
