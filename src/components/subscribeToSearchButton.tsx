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
import { Mail } from 'lucide-react';

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
        <Button variant="ghost" size="sm" className="gap-2">
          <Mail strokeWidth={2} size={14} />
          Get email alerts for this search
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 w-full md:max-w-4xl h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden">
        <DialogHeader className="gap-y-3 bg-gray-lightest dark:bg-neutral-900 px-6 py-5 pr-12 border-gray-light dark:border-neutral-600 border-b text-left shrink-0">
          <DialogTitle className="font-heading font-bold text-2xl tracking-tight">
            {sendState === 'sent' ? "You're subscribed!" : 'Get Email Alerts'}
          </DialogTitle>
          <DialogDescription className="text-gray-dark dark:text-neutral-300 text-base">
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
            <p className="text-warning text-sm">
              Your current filters match no upcoming or past agenda items.
              Alerts may be rare — consider broadening your tags, decision
              bodies, or search text.
            </p>
          )}
          <form onSubmit={onSubmit} className="flex flex-row gap-x-2">
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
        <div className="flex flex-col flex-1 bg-slate-200 dark:bg-neutral-950 p-4 md:p-6 min-h-0">
          <div className="flex-1 bg-white dark:bg-neutral-800 shadow-lg dark:shadow-none border border-gray-light dark:border-none rounded-[13px] min-h-0 overflow-hidden">
            {previewLoading || !previewHtml ? (
              <div className="flex justify-center items-center w-full h-full">
                <Spinner />
              </div>
            ) : (
              <iframe
                title="Email preview"
                srcDoc={withUnclickableLinks(previewHtml)}
                className="bg-white p-2 w-full h-full"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
