import { subscribeToSearch } from '@/backend/emails/subscriptions';
import { useSearch } from '@/contexts/SearchContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export const SubscribeToSearchButton = () => {
  const { searchOptions } = useSearch();
  const [sendState, setSendState] = useState<'ready' | 'loading' | 'sent'>(
    'ready',
  );
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSendState('ready');
  }, [searchOptions]);

  const onChange = useCallback(() => setSendState('ready'), [setSendState]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!emailInputRef.current || !emailInputRef.current.validity.valid) {
        return;
      }
      setSendState('loading');
      await subscribeToSearch({
        email: emailInputRef.current.value,
        filters: searchOptions,
      });
      setSendState('sent');
    },
    [searchOptions],
  );

  return (
    <Popover modal onOpenChange={(isOpen) => isOpen && setSendState('ready')}>
      <PopoverTrigger asChild>
        <Button variant="secondary-outline" data-umami-event="Get Email Alerts">
          Get Email Alerts
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-90 min-w-72">
        <div className="flex flex-col space-y-2">
          <p>
            You will be sent emails for new agenda items matching your current
            tags & search filters, and can unsubscribe at any time. View our{' '}
            <a className="classic-link" href="/privacy" target="_blank">
              privacy policy
            </a>
            .
          </p>
          <form onSubmit={onSubmit} className="flex flex-row space-x-2">
            <Input
              ref={emailInputRef}
              type="email"
              placeholder="Enter email..."
              onChange={onChange}
            />
            {sendState === 'loading' ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                disabled={sendState === 'sent'}
                data-umami-event="Subscribe"
              >
                {sendState === 'ready' ? 'Subscribe' : 'Subscribed'}
              </Button>
            )}
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
