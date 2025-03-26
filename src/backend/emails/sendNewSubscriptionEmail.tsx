'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import {
  NewSubscriptionEmail,
  NewSubscriptionEmailProps,
} from '@/backend/emails/templates/newSubscription';

type Args = {
  to: string | string[];
  props: NewSubscriptionEmailProps;
};
export async function sendNewSubscriptionEmail({ to, props }: Args) {
  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject: 'New search subscription on Civic Dashboard',
    to,
    react: <NewSubscriptionEmail {...props} />,
  });
}
