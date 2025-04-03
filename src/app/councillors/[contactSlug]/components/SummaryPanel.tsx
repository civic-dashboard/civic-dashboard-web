'use client';
import { AiIndicator } from '@/components/AiIndicator';
import { Markdown } from '@/components/Markdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { sanitize } from '@/logic/sanitize';
import { SparklesIcon } from 'lucide-react';
import React, { FC, memo, useLayoutEffect, useRef, useState } from 'react';

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
    return (
      <ExpandableText>
        <SafeSummary summaryHtml={originalSummary} />
      </ExpandableText>
    );
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

const ExpandableText: FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpansionNeeded, setIsExansionNeeded] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setIsExansionNeeded(element.scrollHeight > element.clientHeight);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        className={cn('rich-html-styles overflow-hidden', {
          'max-h-24 line-clamp-5 text-ellipsis': !isExpanded,
        })}
      >
        {children}
      </div>
      <footer className="flex h-10 justify-end mt-2">
        {(isExpansionNeeded || isExpanded) && (
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            className="font-bold ml-auto"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </footer>
    </div>
  );
};

type TabKind = 'ai' | 'original';
