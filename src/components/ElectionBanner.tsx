'use client';

/**
 * Site-wide election notification banner.
 *
 * Two states based on date:
 * - Before Oct 12, 2026: voter registration check message
 * - On/after Oct 12, 2026: general election info message
 *
 * The Oct 12 cutoff is when the City of Toronto's voter registration
 * tool switches from registration lookup to general election information.
 */
const VOTER_INFO_PHASE_START = new Date('2026-10-12T00:00:00Z');
const VOTER_INFO_URL = 'https://myvote.toronto.ca';

export default function ElectionBanner() {
  const isVoterInfoPhase = new Date() >= VOTER_INFO_PHASE_START;

  return (
    <div className="w-full bg-orange-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="text-md font-semibold">
          The Toronto municipal election is Monday, October 26, 2026.{' '}
          {isVoterInfoPhase ? (
            <>
              For more information visit{' '}
              <a
                href={VOTER_INFO_URL}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                myvote.toronto.ca
              </a>
            </>
          ) : (
            <>
              Make sure to check your voter registration at{' '}
              <a
                href={VOTER_INFO_URL}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                myvote.toronto.ca
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
