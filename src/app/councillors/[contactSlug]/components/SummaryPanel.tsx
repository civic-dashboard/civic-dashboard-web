'use client';
import { AiIndicator } from '@/components/AiIndicator';
import { Markdown } from '@/components/Markdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { sanitize } from '@/logic/sanitize';
import { SparklesIcon } from 'lucide-react';
import { FC, useLayoutEffect, useRef, useState } from 'react';

interface SummaryPanelProps {
  originalSummary: string;
  aiSummary: string | null;
}
export const SummaryPanel: FC<SummaryPanelProps> = ({
  originalSummary,
  aiSummary,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpansionNeeded, setIsExansionNeeded] = useState(false);
  const [tab, setTab] = useState<TabKind>(aiSummary ? 'ai' : 'original');

  return (
    <div>
      {tab === 'ai' && aiSummary ? (
        <div>
          <Markdown>{aiSummary.replace('**Context**', '')}</Markdown>
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
        </div>
      ) : (
        <>
          <ExpandableText
            isExpanded={isExpanded}
            onExpansionNeededChanged={setIsExansionNeeded}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(originalSummary),
              }}
            />
          </ExpandableText>
          <footer className="flex">
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
        </>
      )}
    </div>
  );
};

const ExpandableText: FC<{
  isExpanded: boolean;
  onExpansionNeededChanged: (isExpansionNeeded: boolean) => void;
  children: React.ReactNode;
}> = ({ isExpanded, onExpansionNeededChanged, children }) => {
  const ref = useRef<HTMLDivElement>(undefined!);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    onExpansionNeededChanged(element.scrollHeight > element.clientHeight);
  });
  return (
    <div
      ref={ref}
      className={cn('text-sm mb-2 rich-html-styles overflow-hidden', {
        'max-h-24 line-clamp-5 text-ellipsis': !isExpanded,
      })}
    >
      {children}
    </div>
  );
};

type TabKind = 'ai' | 'original';
