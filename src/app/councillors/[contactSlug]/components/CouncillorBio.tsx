'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Councillor } from '@/app/councillors/[contactSlug]/types';
import { CircleUserRound } from 'lucide-react';

export default function CouncillorBio({
  councillor,
}: {
  councillor: Councillor;
}) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="m-8">
      <div className="flex flex-col md:flex-row gap-6">
        {councillor.photoUrl &&
        councillor.photoUrl.trim() !== '' &&
        !imageError ? (
          <div className="min-w-48 max-w-48 h-48 relative rounded-full overflow-hidden">
            <Image
              src={councillor.photoUrl}
              alt={councillor.contactName}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
            <CircleUserRound size={190} />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-2">{councillor.contactName}</h1>
          <p className="text-gray-600 mb-4">{councillor.wardName}</p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
            Follow
          </button>

          <div className="mt-4">
            <p className={`${isBioExpanded ? '' : 'line-clamp-3'}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt.{' '}
            </p>
            <button
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="text-blue-600 hover:text-blue-800 mt-2"
            >
              {isBioExpanded ? 'See less' : 'See more'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
