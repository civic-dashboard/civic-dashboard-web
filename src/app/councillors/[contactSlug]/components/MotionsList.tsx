import { Motion } from '@/app/councillors/[contactSlug]/types';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  CircleMinusIcon,
  CircleDotDashedIcon,
} from 'lucide-react';

const VoteIcon = ({ value }: { value: string }) => {
  switch (value?.toLowerCase()) {
    case 'yes':
      return <ThumbsUpIcon className="w-4 h-4" />;
    case 'no':
      return <ThumbsDownIcon className="w-4 h-4" />;
    case 'absent':
      return <CircleMinusIcon className="w-4 h-4" />;
    default:
      return <CircleDotDashedIcon className="w-4 h-4" />;
  }
};

interface MotionsListProps {
  motions: Motion[];
}

export const MotionsList = ({ motions }: MotionsListProps) => {
  return (
    <div className="mt-2">
      {motions.map((motion) => (
        <div key={motion.motionId} className="border-t p-4">
          <dl className="flex -center mb-2 text-xs gap-1">
            <dt>Date</dt>
            <dd className="text-gray-500">{motion.dateTime}</dd>
            <dt className="ml-auto">Motion</dt>
            <dd className="text-gray-500">{motion.motionType}</dd>
          </dl>

          <dl className="flex flex-row gap-4 justify-between items-center text-xs">
            <div className="flex items-center">
              <dt className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1870F8] text-white text-md">
                <VoteIcon value={motion.value} />
              </dt>
              <dd className="pl-2">
                <div>Vote</div>
                <div className="text-gray-500">{motion.value}</div>
              </dd>
            </div>

            <div className="flex flex-col items-center text-center">
              <dt>Decision body</dt>
              <dd className="text-gray-500">{motion.committeeName}</dd>
            </div>

            <div className="flex flex-col items-center text-center">
              <dt>Total</dt>
              <dd className="text-gray-500">{motion.tally}</dd>
            </div>

            <div className="flex flex-col items-center text-center">
              <dt>Status</dt>
              <dd className="text-gray-500">{motion.resultKind}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
};
