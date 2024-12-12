import { CreateEmailOptions, Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: CreateEmailOptions) {
  const response = await resend.emails.send(options);

  if (response.error) {
    throw new Error('Failed to send email', { cause: response.error });
  }

  return response.data!;
}
