import { CreateEmailOptions, Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  react: React.ReactNode,
  options?: Partial<Omit<CreateEmailOptions, 'html' | 'text' | 'react'>>
) {
  const response = await resend.emails.send({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    to: 'garo.brik@gmail.com',
    subject: 'Your Search Results from Civic Dashboard',
    react,
    ...options,
  });

  if (response.error) {
    throw new Error('Failed to send email', { cause: response.error });
  }

  return response.data!;
}
