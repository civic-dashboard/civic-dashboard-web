'use client';
import { cn } from '@/components/ui/utils';
import { sanitize } from '@/logic/sanitize';
import { FC, useState } from 'react';

export const SummaryPanel: FC<{ summary: string }> = ({ summary }) => {
  const [isExpanded, _setIsExpanded] = useState(false);
  return (
    <div
      className={cn(
        'text-sm text-gray-500 mb-2 rich-html-styles overflow-hidden',
        {
          'max-h-24': isExpanded,
        },
      )}
      dangerouslySetInnerHTML={{
        __html: sanitize(summary),
      }}
    />
  );
};
