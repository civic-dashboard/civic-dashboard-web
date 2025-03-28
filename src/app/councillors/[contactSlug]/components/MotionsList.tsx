import { Motion } from '@/app/councillors/[contactSlug]/types';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  CircleMinusIcon,
  CircleDotDashedIcon,
} from 'lucide-react';

const getVoteIcon = (value: string) => {
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
          <div className="flex justify-between items-center mb-2 text-xs">
            <div>
              <span>Date</span>{' '}
              <span className="text-gray-500">{motion.dateTime}</span>
            </div>
            <div className="font-medium">
              <span>Motion</span>{' '}
              <span className="text-gray-500">{motion.motionType}</span>
            </div>
          </div>

          <div className="flex flex-row gap-4 justify-between items-center text-xs">
            <div className="flex items-center">
              <div className="flex flex-row">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1870F8] text-white text-md">
                  {getVoteIcon(motion.value)}
                </div>
                <div className="pl-2">
                  <div>Vote</div>
                  <div className="text-gray-500">{motion.value}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div>Decision body</div>
              <div className="text-gray-500">{motion.committeeName}</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div>Total</div>
              <div className="text-gray-500">{motion.tally}</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div>Status</div>
              <div className="text-gray-500">{motion.resultKind}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
