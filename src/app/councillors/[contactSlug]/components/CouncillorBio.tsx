'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Councillor } from '@/app/councillors/[contactSlug]/types';

export default function CouncillorBio({
  councillor,
}: {
  councillor: Councillor;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Link href="/councillors" className="text-blue-600 hover:text-blue-800">
          <span className="text-3xl font-bold text-black">←</span>{' '}
          <span className="text-3xl font-bold text-black inline">
            {councillor.contactName}
          </span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {/* Add hamburger icon */}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {councillor.photoUrl &&
        councillor.photoUrl.trim() !== '' &&
        !imageError ? (
          <div className="w-48 h-48 relative rounded-full overflow-hidden">
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
            <span className="text-4xl">😊</span>
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
              {/* Add bio text here */}
              Lorem ipsum ranch I dipsum carrots in the bowl of dip hip hip
              british slang pip pip can I get a new look a new drip teas too hot
              so I blow then sip sip{' '}
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
