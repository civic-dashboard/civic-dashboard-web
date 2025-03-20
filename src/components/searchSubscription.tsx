import { subscribeToSearch } from '@/backend/emails/subscriptions';
import { useSearch } from '@/components/search';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export function SubscribeToSearchButton() {
  const { searchOptions } = useSearch();
  const [sendState, setSendState] = useState<'ready' | 'loading' | 'sent'>(
    'ready',
  );
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSendState('ready');
  }, [searchOptions]);

  const onClick = useCallback(async () => {
    if (!emailInputRef.current || !emailInputRef.current.validity.valid) {
      return;
    }
    setSendState('loading');
    await subscribeToSearch({
      email: emailInputRef.current.value,
      searchOptions,
    });
    setSendState('sent');
  }, [searchOptions]);

  return (
    <Popover onOpenChange={(isOpen) => isOpen && setSendState('ready')}>
      <PopoverTrigger asChild>
        <Button>Subscribe to Search</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col space-y-2">
          <p>
            You will be sent emails for new agenda items matching the following
            search settings:
          </p>
          <div className="flex flex-row space-x-2">
            <Input
              ref={emailInputRef}
              type="email"
              placeholder="Enter email..."
            />
            {sendState === 'loading' ? (
              <Spinner />
            ) : (
              <Button onClick={onClick} disabled={sendState === 'sent'}>
                {sendState === 'ready' ? 'Subscribe' : 'Subscribed'}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
