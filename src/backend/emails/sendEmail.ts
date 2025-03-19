import { Resend } from 'resend';
import { render } from '@react-email/components';

export const resend = new Resend(process.env.RESEND_API_KEY);

type Options = {
  from: string;
  subject: string;
  to: string;
  react: React.ReactElement;
};
export async function sendEmail(options: Options) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
    });

    const { react, ...emailOptions } = options;
    await transport.sendMail({ ...emailOptions, html: await render(react) });
    return;
  }

  const response = await resend.emails.send(options);

  if (response.error) {
    throw new Error('Failed to send email', { cause: response.error });
  }

  return response.data!;
}
