import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import type { Resend } from 'resend';
import { sendWithResend } from '@/backend/emails/sendEmail';
import { FeedbackEmailTemplate } from '@/backend/emails/templates/feedback';

type SendPayload = Parameters<Resend['emails']['send']>[0];

function fakeClient(result: Awaited<ReturnType<Resend['emails']['send']>>) {
  const calls: SendPayload[] = [];
  const client = {
    emails: {
      send: async (payload: SendPayload) => {
        calls.push(payload);
        return result;
      },
    },
  } as unknown as Pick<Resend, 'emails'>;
  return { client, calls };
}

const options = {
  from: 'Civic Dashboard <alerts@civicdashboard.ca>',
  subject: 'New Feedback – Civic Dashboard',
  to: 'team@example.com',
  react: createElement(FeedbackEmailTemplate, {
    payload: { type: 'text', message: 'The map is great', name: 'Sam' },
  }),
};

// #580: passing `react` made Resend import the uninstalled
// `@react-email/render` and throw on every production email.
test('sendWithResend sends rendered HTML, not a React element', async () => {
  const { client, calls } = fakeClient({
    data: { id: 'email_1' },
    error: null,
    headers: null,
  });

  const data = await sendWithResend(client, options);

  assert.deepEqual(data, { id: 'email_1' });
  assert.equal(calls.length, 1);
  const sent = calls[0];
  assert.equal('react' in sent, false);
  assert.equal(sent.from, options.from);
  assert.equal(sent.to, options.to);
  assert.equal(sent.subject, options.subject);
  assert.ok(typeof sent.html === 'string');
  assert.match(sent.html, /The map is great/);
  assert.match(sent.html, /From: (<!-- -->)?Sam/);
});

test('sendWithResend throws when Resend returns an error', async () => {
  const resendError = {
    name: 'validation_error' as const,
    message: 'Invalid `to` field',
    statusCode: 422,
  };
  const { client } = fakeClient({
    data: null,
    error: resendError,
    headers: null,
  });

  await assert.rejects(
    sendWithResend(client, options),
    (err: Error) =>
      err.message === 'Failed to send email' && err.cause === resendError,
  );
});
