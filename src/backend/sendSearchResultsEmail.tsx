'use server';

import Email, { Props } from '@/emails/searchResultsEmail';
import { sendEmail } from '@/backend/sendEmail';

type Args = {
  to: string | string[];
  props: Props;
};
export async function sendSearchResultsEmail({ to, props }: Args) {
  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject: 'Your Search Results from Civic Dashboard',
    to,
    react: <Email {...props} />,
  });
}
