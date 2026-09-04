import { DecisionBody, fetchDecisionBodies } from '@/api/decisionBody';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { createDB } from '@/database/kyselyDb';
import { upsertDecisionBodies } from '@/database/queries/decisionBodies';

const db = createDB();

const bodies: Record<number, DecisionBody> = {};
for (let termId = 0; termId <= CURRENT_COUNCIL_TERM; termId++) {
  console.log('fetching for', termId);
  const thisTermBodies = await fetchDecisionBodies({ termId });
  console.log(`got ${Object.values(thisTermBodies).length} values`);
  // Later terms overwrite earlier ones for the same decisionBodyId.
  Object.assign(bodies, thisTermBodies);
}

const values = Object.values(bodies);
console.log(`upserting ${values.length} decision bodies`);
await upsertDecisionBodies(db, values);
console.log('done');

process.exit(0);
