'use client';
import { cn } from '@/components/ui/utils';
import { sanitize } from '@/logic/sanitize';
import { FC, useState } from 'react';

export const SummaryPanel: FC<{ summary: string }> = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div
        className={cn('text-sm mb-2 rich-html-styles overflow-hidden', {
          'max-h-24 line-clamp-5 text-ellipsis': !isExpanded,
        })}
        dangerouslySetInnerHTML={{
          __html: sanitize(summary),
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
    </div>
  );
};
