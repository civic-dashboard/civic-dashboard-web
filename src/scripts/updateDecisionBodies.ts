import { fetchDecisionBodies } from '@/api/decisionBody';
import { createDB } from '@/database/kyselyDb';
import { upsertDecisionBodies } from '@/database/queries/decisionBodies';
import { fetchDecisionBodiesForAllTerms } from '@/logic/councilTerm';

const db = createDB();

const bodies = await fetchDecisionBodiesForAllTerms(async (termId) => {
  console.log('fetching for', termId);
  const thisTermBodies = await fetchDecisionBodies({ termId });
  console.log(`got ${Object.values(thisTermBodies).length} values`);
  return thisTermBodies;
});

const values = Object.values(bodies);
console.log(`upserting ${values.length} decision bodies`);
await upsertDecisionBodies(db, values);
console.log('done');

process.exit(0);
