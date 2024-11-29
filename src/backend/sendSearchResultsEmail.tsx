'use server';

import Email, { Props } from '@/emails/searchResultsEmail';
import { sendEmail } from '@/backend/sendEmail';

export async function sendSearchResultsEmail(props: Props) {
  return await sendEmail(<Email {...props} />);
}
