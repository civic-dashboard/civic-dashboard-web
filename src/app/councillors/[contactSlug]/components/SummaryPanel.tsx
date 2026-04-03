'use client';
import { AiIndicator } from '@/components/AiIndicator';
import { Markdown } from '@/components/Markdown';
import { Button } from '@/components/ui/button';
import { sanitize } from '@/logic/sanitize';
import { SparklesIcon } from 'lucide-react';
import React, { FC, memo, useState } from 'react';

interface SummaryPanelProps {
  originalSummary: string;
  aiSummary: string | null;
}
export const SummaryPanel: FC<SummaryPanelProps> = ({
  originalSummary,
  aiSummary,
}) => {
  const [tab, setTab] = useState<TabKind>(aiSummary ? 'ai' : 'original');

  if (!aiSummary) {
    return <SafeSummary summaryHtml={originalSummary} />;
  }

  return (
    <div>
      {tab === 'ai' ? (
        <>
          <div className="text-sm">
            {/* Todo: Determine if we can omit this header from the prompt */}
            <Markdown>{aiSummary.replace('**Context**', '')}</Markdown>
          </div>
          <footer className="flex justify-between mt-2">
            <AiIndicator />
            <Button
              variant="ghost"
              className="font-bold"
              onClick={() => setTab('original')}
            >
              Show original
            </Button>
          </footer>
        </>
      ) : (
        <>
          <SafeSummary summaryHtml={originalSummary} />
          <footer className="flex h-10 mt-2">
            {aiSummary && (
              <Button
                variant="ghost"
                className="font-bold"
                onClick={() => setTab('ai')}
              >
                <SparklesIcon />
                Show AI Summary
              </Button>
            )}
          </footer>
        </>
      )}
    </div>
  );
};

const SafeSummary = memo(function SafeSummary({
  summaryHtml,
}: {
  summaryHtml: string;
}) {
  return (
    <div
      className="text-sm rich-html-styles"
      dangerouslySetInnerHTML={{
        __html: sanitize(summaryHtml),
      }}
    />
  );
});

type TabKind = 'ai' | 'original';
