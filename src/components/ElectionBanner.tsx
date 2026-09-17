'use client';
import { useSyncExternalStore } from 'react';

/**
 * Site-wide election notification banner.
 *
 * Two states based on date:
 * - Before Oct 12, 2026: voter registration check message
 * - On/after Oct 12, 2026: general election info message
 * - On/after Oct 27, 2026: banner hidden
 *
 * The Oct 12 cutoff is when the City of Toronto's voter registration
 * tool switches from registration lookup to general election information.
 */

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Recommended solution for checking if hydration happened.
// Replacement for using setState which will trigger react-hooks/set-state-in-effect issues.
const useIsHydrated = () => {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
};

const VOTER_INFO_PHASE_START = new Date('2026-10-12T00:00:00Z');
const ELECTION_PAST_DATE = new Date('2026-10-27T00:00:00Z');
const VOTER_INFO_URL = 'https://myvote.toronto.ca';

export default function ElectionBanner() {
  const now = new Date();
  const isVoterInfoPhase = now >= VOTER_INFO_PHASE_START;
  const isPastElection = now >= ELECTION_PAST_DATE;
  const isHydrated = useIsHydrated();

  if (!isHydrated || isPastElection) return null;
  return (
    <div className="w-full bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="text-md text-center font-semibold">
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
