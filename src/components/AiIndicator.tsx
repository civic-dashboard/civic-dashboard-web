import { BookIcon, SparkleIcon } from 'lucide-react';
import { FC } from 'react';

const size = 20;

export const AiIndicator: FC = () => {
  return (
    <div className="inline-flex items-center gap-2 lh cursor-default">
      <span className="inline-block relative">
        <BookIcon size={size} />
        <SparkleIcon
          size={size / 2}
          strokeWidth={4}
          className="absolute top-0 right-0 bg-white dark:bg-black"
        />
      </span>
      <strong className="text-md">AI Generated</strong>
    </div>
  );
};
