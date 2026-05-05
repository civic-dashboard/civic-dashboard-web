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
  role: 'Councillor';
  wardName: string;
  wardId: string;
};

type MayorBioInfo = SharedBioInfo & {
  role: 'Mayor';
};

export default function ContactBio({
  contact,
  committees,
}: {
  contact: CouncillorBioInfo | MayorBioInfo;
  committees: { decisionBodyId: number; decisionBodyName: string }[];
}) {
  const [showFallbackAvatar, setShowFallbackAvatar] = useState(
    !contact.photoUrl,
  );

  let wardURL = '';
  let councillorProfileURL = '';

  if (contact.role === 'Councillor') {
    wardURL = `https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/ward-profiles/ward-${contact.wardId}-${contact.wardName}`;
    councillorProfileURL = `https://www.toronto.ca/city-government/council/members-of-council/councillor-ward-${contact.wardId}`;
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {showFallbackAvatar ? (
          <div className="w-48 h-48 light:bg-gray-200 rounded-full flex items-center justify-center">
            <CircleUserRound size={190} />
          </div>
        ) : (
          <div className="min-w-48 max-w-48 h-48 relative rounded-full overflow-hidden">
            <Image
              src={contact.photoUrl!}
              alt={`Photo of ${contact.contactName}`}
              fill
              className="object-cover object-top"
              onError={() => setShowFallbackAvatar(true)}
            />
          </div>
        )}

        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl font-bold">{contact.contactName}</h1>
          <div className="md:space-y-1">
            {contact.role === 'Councillor' && (
              <p>
                <ExternalLink
                  href={councillorProfileURL}
                  className="classic-link"
                >
                  Councillor Profile
                </ExternalLink>
              </p>
            )}
            {contact.role === 'Councillor' && (
              <p>
                <ExternalLink href={wardURL} className="classic-link">
                  Ward {contact.wardId}, {contact.wardName}
                </ExternalLink>
              </p>
            )}
            {contact.role === 'Mayor' && (
              <p>
                <ExternalLink
                  href="https://www.toronto.ca/city-government/council/office-of-the-mayor/"
                  className="classic-link"
                >
                  Office of the Mayor
                </ExternalLink>
              </p>
            )}
            {contact.role === 'Mayor' && <p>Mayor of Toronto</p>}
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 md:gap-y-1 text-left">
            <dt className="font-bold">Email</dt>
            <dd>
              <a className="classic-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </dd>

            {contact.phone && (
              <>
                <dt className="font-bold">Phone</dt>
                <dd>
                  <a className="classic-link" href={`tel:${contact.phone}`}>
                    {contact.phone}
                  </a>
                </dd>
              </>
            )}

            {committees.length > 0 && (
              <>
                <dt className="font-bold">Committees & Boards</dt>
                <dd>
                  <ul className="list-none p-0 m-0">
                    {committees.map((committee) => (
                      <li key={committee.decisionBodyId}>
                        <ExternalLink
                          href={`https://secure.toronto.ca/council/#/committees/${committee.decisionBodyId}`}
                          className="classic-link"
                        >
                          {committee.decisionBodyName}
                        </ExternalLink>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">
          {contact.role === 'Mayor' ? 'Mayor' : 'Councillor'} Voting Record
        </h2>
        <p>
          Here are all the past agenda items that the{' '}
          {contact.role === 'Mayor' ? 'mayor' : 'councillor'} has voted on
          during the current city council session. For each item, you may find
          the item date, a link to the item, an item description, the{' '}
          {contact.role === 'Mayor' ? "mayor's" : "councillor's"} vote on the
          item, the decision body voting on the item, the result of the vote
          (yes - no), and status of the item. Please note that there may be
          multiple votes on one item, such as in the case of proposed
          amendments.
        </p>
      </div>
    </section>
  );
}
