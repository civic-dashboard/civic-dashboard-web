'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import { FeedbackEmailTemplate } from '@/backend/emails/templates/feedback';
import type { FeedbackPayload } from '@/types/feedback';

export async function sendFeedbackEmail(payload: FeedbackPayload) {
  const subject =
    payload.type === 'text'
      ? 'New Feedback – Civic Dashboard'
      : 'User Interview Signup – Civic Dashboard';

  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject,
    to: 'teamcivicdashboard@gmail.com',
    react: <FeedbackEmailTemplate payload={payload} />,
  });
}
