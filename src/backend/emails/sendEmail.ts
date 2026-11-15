import { Resend } from 'resend';
import { render } from 'react-email';

type Options = {
  from: string;
  subject: string;
  to: string | string[];
  react: React.ReactElement;
};

export async function sendEmail(options: Options) {
  // Render the HTML ourselves rather than passing `react` to Resend. Since v5,
  // Resend's own rendering needs the optional peer `@react-email/render`, which
  // we don't install (we use `react-email`), so every production email threw
  // "Failed to render React component" (#580). Rendering here for both dev and
  // prod keeps the two transports from drifting apart.
  const { react, ...emailOptions } = options;
  const email = { ...emailOptions, html: await render(react) };

  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
    });

    await transport.sendMail(email);
    return;
  }

  const response = await new Resend(process.env.RESEND_API_KEY).emails.send(
    email,
  );

  if (response.error) {
    throw new Error('Failed to send email', { cause: response.error });
  }

  return response.data!;
}
