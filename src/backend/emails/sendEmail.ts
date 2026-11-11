import { Resend } from 'resend';
import { render } from 'react-email';

type Options = {
  from: string;
  subject: string;
  to: string | string[];
  react: React.ReactElement;
};

type ResendClient = Pick<Resend, 'emails'>;

// Render the HTML ourselves rather than passing `react` to Resend. Since v5,
// Resend's own rendering needs the optional peer `@react-email/render`, which
// we don't install (we use `react-email`), so every production email threw
// "Failed to render React component" (#580).
export async function sendWithResend(client: ResendClient, options: Options) {
  const { react, ...emailOptions } = options;
  const response = await client.emails.send({
    ...emailOptions,
    html: await render(react),
  });

  if (response.error) {
    throw new Error('Failed to send email', { cause: response.error });
  }

  return response.data!;
}

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

  return sendWithResend(new Resend(process.env.RESEND_API_KEY), options);
}
