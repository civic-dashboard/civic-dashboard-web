import {
  ThumbsUp,
  ThumbsDown,
  CircleMinus,
  CircleDotDashed,
} from 'lucide-react';

interface Motion {
  motionId: string;
  dateTime: string;
  motionType: string;
  value: string;
  committeeSlug: string;
  result: string;
  resultKind: string;
}

const getVoteIcon = (value: string) => {
  switch (value?.toLowerCase()) {
    case 'yes':
      return <ThumbsUp className="w-4 h-4" />;
    case 'no':
      return <ThumbsDown className="w-4 h-4" />;
    case 'absent':
      return <CircleMinus className="w-4 h-4" />;
    default:
      return <CircleDotDashed className="w-4 h-4" />;
  }
};

const cleanUpCommitteeSlug = (slug: string): string => {
  const smallWords = ['and', 'of', 'the'];

  return slug
    .split('-')
    .map((word, index) => {
      if (index !== 0 && smallWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const cleanUpMotionResult = (result: string): string => {
  const match = result.match(/(\d+-\d+)/);
  return match ? match[1] : '';
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
              <div className="text-gray-500">
                {cleanUpCommitteeSlug(motion.committeeSlug)}
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div>Total</div>
              <div className="text-gray-500">
                {cleanUpMotionResult(motion.result)}
              </div>
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
