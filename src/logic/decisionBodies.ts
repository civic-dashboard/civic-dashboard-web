import { DecisionBody } from '@/api/decisionBody';
import { createDB } from '@/database/kyselyDb';
import { getDecisionBodies } from '@/database/queries/decisionBodies';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

const fetchCachedDecisionBodies = unstable_cache(
  async (): Promise<Record<number, DecisionBody>> => {
    return getDecisionBodies(createDB());
  },
  ['decision-bodies'],
  { revalidate: 86400 },
);

/** Request-deduped, cross-request cached decision bodies map (Next.js only). */
export const getCachedDecisionBodies = cache(() => fetchCachedDecisionBodies());
