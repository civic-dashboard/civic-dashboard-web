'use client';
import { Markdown } from '@/components/Markdown';
import { cn } from '@/components/ui/utils';
import { sanitize } from '@/logic/sanitize';
import { FC, useState } from 'react';

interface SummaryPanelProps {
  originalSummary: string;
  aiSummary: string | null;
}
export const SummaryPanel: FC<SummaryPanelProps> = ({
  originalSummary,
  aiSummary,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tab] = useState<TabKind>(aiSummary ? 'ai' : 'original');
  return (
    <div>
      {tab === 'ai' && aiSummary ? (
        <div>
          <Markdown>{aiSummary}</Markdown>
          <p>AI summary</p>
        </div>
      ) : (
        <>
          <div
            className={cn('text-sm mb-2 rich-html-styles overflow-hidden', {
              'max-h-24 line-clamp-5 text-ellipsis': !isExpanded,
            })}
            dangerouslySetInnerHTML={{
              __html: sanitize(originalSummary),
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm cursor-pointer font-semibold"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

type TabKind = 'ai' | 'original';
