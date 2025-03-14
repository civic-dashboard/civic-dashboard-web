'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';

type CouncillorBioInfo = {
  photoUrl: string | null;
  contactName: string;
  wardName: string;
  wardId: string;
  email: string;
  phone: string | null;
};

export default function CouncillorBio({
  councillor,
}: {
  councillor: CouncillorBioInfo;
}) {
  const [showFallbackAvatar, setShowFallbackAvatar] = useState(
    !councillor.photoUrl,
  );

  return (
    <section className="m-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {showFallbackAvatar ? (
          <div className="w-48 h-48 light:bg-gray-200 rounded-full flex items-center justify-center">
            <CircleUserRound size={190} />
          </div>
        ) : (
          <div className="min-w-48 max-w-48 h-48 relative rounded-full overflow-hidden">
            <Image
              src={councillor.photoUrl!}
              alt={councillor.contactName}
              fill
              className="object-cover object-top"
              onError={() => setShowFallbackAvatar(true)}
            />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-2">{councillor.contactName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ward {councillor.wardId}, {councillor.wardName}
          </p>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="font-bold">Email</dt>
            <dd>
              <a
                className="text-blue-500 underline"
                href={`mailto:${councillor.email}`}
              >
                {councillor.email}
              </a>
            </dd>

            {councillor.phone && (
              <>
                <dt className="font-bold">Phone</dt>
                <dd>
                  <a
                    className="text-blue-500 underline"
                    href={`tel:${councillor.phone}`}
                  >
                    {councillor.phone}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
