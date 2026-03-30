'use client';

import { MotionWithVotes } from '@/database/queries/agendaItems';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  CircleMinusIcon,
  CircleDotDashedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  CalendarIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/Avatar';
import Link from 'next/link';
import { cn } from '@/components/ui/utils';

const VoteIcon = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  switch (value?.toLowerCase()) {
    case 'yes':
      return (
        <ThumbsUpIcon
          className={cn('w-4 h-4 text-green-600', className)}
          aria-label="Yes"
        />
      );
    case 'no':
      return (
        <ThumbsDownIcon
          className={cn('w-4 h-4 text-red-600', className)}
          aria-label="No"
        />
      );
    case 'absent':
      return (
        <CircleMinusIcon
          className={cn('w-4 h-4 text-gray-400', className)}
          aria-label="Absent"
        />
      );
    default:
      return (
        <CircleDotDashedIcon
          className={cn('w-4 h-4 text-gray-400', className)}
          aria-label="Unknown"
        />
      );
  }
};

interface VotingRecordProps {
  motions: MotionWithVotes[];
}

export const VotingRecord = ({ motions }: VotingRecordProps) => {
  const [showAll, setShowAll] = useState(false);
  if (motions.length === 0) return null;

  const threshold = 3;
  const hasMore = motions.length > threshold;
  const motionsToShow = showAll ? motions : motions.slice(0, threshold);

  // Grouping logic for rendering - Group by Committee Name ONLY
  const groups: {
    committeeName: string;
    motions: MotionWithVotes[];
  }[] = [];

  motionsToShow.forEach((motion) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.committeeName === motion.committeeName) {
      lastGroup.motions.push(motion);
    } else {
      groups.push({
        committeeName: motion.committeeName,
        motions: [motion],
      });
    }
  });

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6">Voting Record</h3>
      <div className="space-y-10">
        {groups.map((group, groupIdx) => (
          <div key={`${group.committeeName}-${groupIdx}`}>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <MapPinIcon className="w-4 h-4" aria-hidden="true" />
              <span>{group.committeeName}</span>
            </div>
            <div className="space-y-4">
              {group.motions.map((motion) => (
                <MotionCard key={motion.motionId} motion={motion} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="w-full sm:w-auto"
          >
            {showAll
              ? 'Show less'
              : `Show ${motions.length - threshold} more ${
                  motions.length - threshold === 1 ? 'motion' : 'motions'
                }`}
          </Button>
        </div>
      )}
    </div>
  );
};

const MotionCard = ({ motion }: { motion: MotionWithVotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const yesVotes = motion.votes.filter((v) => v.value.toLowerCase() === 'yes');
  const noVotes = motion.votes.filter((v) => v.value.toLowerCase() === 'no');
  const absentVotes = motion.votes.filter(
    (v) => v.value.toLowerCase() === 'absent',
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-neutral-800 shadow-sm border-neutral-200 dark:border-neutral-700">
      <div className="p-4 border-b bg-gray-50/50 dark:bg-neutral-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1.5">
              <CalendarIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{motion.dateTime}</span>
            </div>
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {motion.motionType}
            </div>
            <h4 className="font-medium text-base leading-snug">
              {motion.voteDescription}
            </h4>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">
                Result
              </div>
              <div
                className={cn(
                  'font-bold px-2 py-0.5 rounded text-sm min-w-[80px]',
                  motion.resultKind.toLowerCase() === 'carried'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                )}
              >
                {motion.result}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <ThumbsUpIcon
              className="w-4 h-4 text-green-600"
              aria-hidden="true"
            />
            <span className="font-semibold">{yesVotes.length} Yes</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDownIcon
              className="w-4 h-4 text-red-600"
              aria-hidden="true"
            />
            <span className="font-semibold">{noVotes.length} No</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleMinusIcon
              className="w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <span className="font-semibold">{absentVotes.length} Absent</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between hover:bg-gray-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 font-normal"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded
            ? 'Hide detailed votes'
            : 'Show detailed councillor votes'}
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {motion.votes.map((vote) => (
              <Link
                key={vote.contactSlug}
                href={`/councillors/${vote.contactSlug}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 border border-transparent hover:border-gray-200 dark:hover:border-neutral-600 transition-colors"
              >
                <Avatar size={32} src={vote.photoUrl} alt={vote.contactName} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-100">
                    {vote.contactName}
                  </div>
                </div>
                <VoteIcon value={vote.value} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
