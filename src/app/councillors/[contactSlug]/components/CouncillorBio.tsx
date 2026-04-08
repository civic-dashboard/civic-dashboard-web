'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';
import { ExternalLink } from '@/components/ExternalLink';

type SharedBioInfo = {
  photoUrl: string | null;
  contactName: string;
  email: string;
  phone: string | null;
};

type CouncillorBioInfo = SharedBioInfo & {
  role: 'councillor';
  wardName: string;
  wardId: string;
};

type MayorBioInfo = SharedBioInfo & {
  role: 'mayor';
};

export default function ContactBio({
  contact,
}: {
  contact: CouncillorBioInfo | MayorBioInfo;
}) {
  const [showFallbackAvatar, setShowFallbackAvatar] = useState(
    !contact.photoUrl,
  );

  let wardURL = '';
  let councillorProfileURL = '';

  if (contact.role === 'councillor') {
    wardURL = `https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/ward-profiles/ward-${contact.wardId}-${contact.wardName}`;
    councillorProfileURL = `https://www.toronto.ca/city-government/council/members-of-council/councillor-ward-${contact.wardId}`;
  }

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
              src={contact.photoUrl!}
              alt={contact.contactName}
              fill
              className="object-cover object-top"
              onError={() => setShowFallbackAvatar(true)}
            />
          </div>
        )}

        <div>
          <h1 className="text-h2 mb-2">{contact.contactName}</h1>
          {contact.role === 'councillor' && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <ExternalLink
                href={councillorProfileURL}
                className="classic-link"
              >
                Councillor Profile
              </ExternalLink>
            </p>
          )}
          {contact.role === 'councillor' && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <ExternalLink href={wardURL} className="classic-link">
                Ward {contact.wardId}, {contact.wardName}
              </ExternalLink>
            </p>
          )}
          {contact.role === 'mayor' && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <ExternalLink
                href="https://www.toronto.ca/city-government/council/office-of-the-mayor/"
                className="classic-link"
              >
                Office of the Mayor
              </ExternalLink>
            </p>
          )}
          {contact.role === 'mayor' && <p>Mayor of Toronto</p>}

          <dl className="text-body mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="text-h4">Email</dt>
            <dd>
              <a
                className="text-blue-500 underline"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </dd>

            {contact.phone && (
              <>
                <dt className="text-h4">Phone</dt>
                <dd>
                  <a
                    className="text-blue-500 underline"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-h3 mb-4">
          {contact.role === 'mayor' ? 'Mayor' : 'Councillor'} Voting Record
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Here are all the past agenda items that the{' '}
          {contact.role === 'mayor' ? 'mayor' : 'councillor'} has voted on
          during the current city council session. For each item, you may find
          the item date, a link to the item, an item description, the{' '}
          {contact.role === 'mayor' ? "mayor's" : "councillor's"} vote on the
          item, the decision body voting on the item, the result of the vote
          (yes - no), and status of the item. Please note that there may be
          multiple votes on one item, such as in the case of proposed
          amendments.
        </p>
      </div>
    </section>
  );
}
