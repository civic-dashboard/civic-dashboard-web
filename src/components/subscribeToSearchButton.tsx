import { subscribeToSearch } from '@/backend/emails/subscriptions';
import { useSearch } from '@/contexts/SearchContext';
import { useCallback, useRef, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { logAnalytics } from '@/api/analytics';

/** Keep preview links visible but non-interactive without blocking iframe scroll. */
function withUnclickableLinks(html: string) {
  const disableLinksStyle =
    '<style>a{pointer-events:none;cursor:default}</style>';
  if (html.includes('</head>')) {
    return html.replace('</head>', `${disableLinksStyle}</head>`);
  }
  return `${disableLinksStyle}${html}`;
}

export const SubscribeToSearchButton = () => {
  const { searchOptions } = useSearch();
  const [sendState, setSendState] = useState<'ready' | 'loading' | 'sent'>(
    'ready',
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Track the searchOptions value from the previous render
  const [prevSearchOptions, setPrevSearchOptions] = useState(searchOptions);

  // If searchOptions changed since last render, reset the send state
  if (searchOptions !== prevSearchOptions) {
    setPrevSearchOptions(searchOptions);
    setSendState('ready');
  }

  const onChange = useCallback(() => setSendState('ready'), [setSendState]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!emailInputRef.current || !emailInputRef.current.validity.valid) {
        return;
      }
      setSendState('loading');
      const result = await subscribeToSearch({
        email: emailInputRef.current.value,
        filters: searchOptions,
      });
      setSendState('sent');
      if (result?.previewHtml) {
        setPreviewHtml(result.previewHtml);
        setPopoverOpen(false);
        setPreviewOpen(true);
      }
    },
    [searchOptions],
  );

  return (
    <>
      <Popover
        modal
        open={popoverOpen}
        onOpenChange={(isOpen) => {
          setPopoverOpen(isOpen);
          if (!isOpen) return;
          setSendState('ready');
          logAnalytics('Get Email Alerts opened');
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
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
                required
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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-full flex-col gap-0 overflow-hidden p-0 md:max-w-4xl">
          <DialogHeader className="shrink-0 space-y-2 border-b border-gray-light bg-gray-lightest px-6 py-5 pr-12 text-left dark:border-neutral-600 dark:bg-neutral-900">
            <DialogTitle className="font-heading text-2xl font-bold tracking-tight">
              You're subscribed!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-dark dark:text-neutral-300">
              Here's a preview of the email alerts you'll get when new matching
              agenda items appear.
            </DialogDescription>
          </DialogHeader>
          {previewHtml && (
            <div className="flex min-h-0 flex-1 flex-col bg-slate-200 p-4 md:p-6 dark:bg-neutral-950">
              <div className="min-h-0 flex-1 overflow-hidden rounded-[13px] border border-gray-light bg-white shadow-lg dark:border-none dark:bg-neutral-800 dark:shadow-none">
                <iframe
                  title="Email preview"
                  srcDoc={withUnclickableLinks(previewHtml)}
                  className="h-full w-full bg-white p-2"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
