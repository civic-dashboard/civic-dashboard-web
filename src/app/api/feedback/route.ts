import { NextRequest } from 'next/server';
import { sendFeedbackEmail } from '@/backend/emails/sendFeedbackEmail';
import type { FeedbackPayload } from '@/types/feedback';

function isValidPayload(body: unknown): body is FeedbackPayload {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  if (b.type === 'text') {
    return (
      typeof b.message === 'string' &&
      b.message.trim().length > 0 &&
      typeof b.name === 'string'
    );
  }
  if (b.type === 'interview') {
    return (
      typeof b.name === 'string' &&
      b.name.trim().length > 0 &&
      typeof b.email === 'string' &&
      b.email.trim().length > 0 &&
      typeof b.availability === 'string' &&
      b.availability.trim().length > 0 &&
      typeof b.anythingElse === 'string'
    );
  }
  return false;
}

function formatSlackMessage(payload: FeedbackPayload): string {
  if (payload.type === 'text') {
    const namePrefix = payload.name.trim() ? `*From:* ${payload.name}\n` : '';
    return `*New Feedback*\n${namePrefix}*Message:*\n${payload.message}`;
  }
  return `*User Interview Signup*\n*Name:* ${payload.name}\n*Email:* ${payload.email}\n*Availability:* ${payload.availability}${payload.anythingElse.trim() ? `\n*Anything else:* ${payload.anythingElse}` : ''}`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json(
      { error: 'Invalid feedback payload' },
      { status: 422 },
    );
  }

  const payload = body;

  const slackOk = process.env.SLACK_FEEDBACK_WEBHOOK_URL
    ? await fetch(process.env.SLACK_FEEDBACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formatSlackMessage(payload) }),
      })
        .then((res) => res.ok)
        .catch(() => false)
    : false;

  if (slackOk) {
    return Response.json({ success: true });
  }

  try {
    await sendFeedbackEmail(payload);
    return Response.json({ success: true });
  } catch (_e) {
    return Response.json({ error: 'Failed to send feedback' }, { status: 500 });
  }
}
