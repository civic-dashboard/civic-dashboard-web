import {
  previewSubscriptionEmail,
  subscribeToSearch,
} from '@/backend/emails/subscriptions';
import { useSearch } from '@/contexts/SearchContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preview, setPreview] = useState<{
    key: string;
    html: string;
    hasMatchingResults: boolean;
  } | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Track the searchOptions value from the previous render
  const [prevSearchOptions, setPrevSearchOptions] = useState(searchOptions);

  // If searchOptions changed since last render, reset the send state
  if (searchOptions !== prevSearchOptions) {
    setPrevSearchOptions(searchOptions);
    setSendState('ready');
  }

  const previewKey = dialogOpen
    ? JSON.stringify({
        textQuery: searchOptions.textQuery,
        tags: searchOptions.tags,
        decisionBodyIds: searchOptions.decisionBodyIds,
      })
    : null;

  useEffect(() => {
    if (!previewKey) return;

    let cancelled = false;
    previewSubscriptionEmail({ filters: searchOptions }).then((result) => {
      if (cancelled) return;
      setPreview({
        key: previewKey,
        html: result.previewHtml,
        hasMatchingResults: result.hasMatchingResults,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [previewKey, searchOptions]);

  const previewLoading = dialogOpen && preview?.key !== previewKey;
  const previewHtml = preview?.key === previewKey ? preview.html : null;
  const hasMatchingResults =
    preview?.key === previewKey ? preview.hasMatchingResults : true;

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
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) return;
        setSendState('ready');
        logAnalytics('Get Email Alerts opened');
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Get Email Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-full flex-col gap-0 overflow-hidden p-0 md:max-w-4xl">
        <DialogHeader className="shrink-0 space-y-3 border-b border-gray-light bg-gray-lightest px-6 py-5 pr-12 text-left dark:border-neutral-600 dark:bg-neutral-900">
          <DialogTitle className="font-heading text-2xl font-bold tracking-tight">
            {sendState === 'sent' ? "You're subscribed!" : 'Get Email Alerts'}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-dark dark:text-neutral-300">
            {sendState === 'sent' ? (
              "Here's a preview of the email alerts you'll get when new matching agenda items appear."
            ) : (
              <>
                You will be sent emails for new agenda items matching your
                current tags & search filters, and can unsubscribe at any time.
                View our{' '}
                <a className="classic-link" href="/privacy" target="_blank">
                  privacy policy
                </a>
                .
              </>
            )}
          </DialogDescription>
          {!previewLoading && !hasMatchingResults && sendState !== 'sent' && (
            <p className="text-sm text-warning">
              Your current filters match no upcoming or past agenda items.
              Alerts may be rare — consider broadening your tags, decision
              bodies, or search text.
            </p>
          )}
          <form onSubmit={onSubmit} className="flex flex-row space-x-2">
            <Input
              ref={emailInputRef}
              type="email"
              placeholder="Enter email..."
              required
              onChange={onChange}
              disabled={sendState === 'sent'}
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
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col bg-slate-200 p-4 md:p-6 dark:bg-neutral-950">
          <div className="min-h-0 flex-1 overflow-hidden rounded-[13px] border border-gray-light bg-white shadow-lg dark:border-none dark:bg-neutral-800 dark:shadow-none">
            {previewLoading || !previewHtml ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <iframe
                title="Email preview"
                srcDoc={withUnclickableLinks(previewHtml)}
                className="h-full w-full bg-white p-2"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
