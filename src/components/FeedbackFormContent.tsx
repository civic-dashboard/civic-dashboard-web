'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import type { FeedbackPayload } from '@/types/feedback';

type Mode = 'text' | 'interview';
type SendState = 'ready' | 'loading' | 'sent';

export function FeedbackFormContent() {
  const [mode, setMode] = useState<Mode>('text');
  const [sendState, setSendState] = useState<SendState>('ready');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [availability, setAvailability] = useState('');

  const onModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSendState('ready');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendState('loading');

    const payload: FeedbackPayload =
      mode === 'text'
        ? { type: 'text', message, name }
        : { type: 'interview', name, email, availability };

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSendState(response.ok ? 'sent' : 'ready');
  };

  if (sendState === 'sent') {
    return (
      <div className="flex flex-col gap-4">
        <p>
          Thank you! We read every piece of feedback and truly appreciate it.
        </p>
        <Button
          variant="secondary-outline"
          size="sm"
          onClick={() => setSendState('ready')}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === 'text' ? 'default' : 'secondary-outline'}
          className={
            mode === 'text'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : ''
          }
          size="sm"
          onClick={() => onModeChange('text')}
        >
          Share Thoughts
        </Button>
        <Button
          type="button"
          variant={mode === 'interview' ? 'default' : 'secondary-outline'}
          className={
            mode === 'interview'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : ''
          }
          size="sm"
          onClick={() => onModeChange('interview')}
        >
          User Interview
        </Button>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode === 'text' ? (
          <>
            <TextArea
              placeholder="Your thoughts..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        ) : (
          <>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sign up for a 30–60 minute remote conversation with a member of
              our team.
            </p>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextArea
              placeholder="Your availability in the next 2–3 weeks"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            />
          </>
        )}

        {sendState === 'loading' ? (
          <Spinner size="small" />
        ) : (
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {mode === 'text' ? 'Send Feedback' : 'Sign Up for Interview'}
          </Button>
        )}
      </form>
    </div>
  );
}
