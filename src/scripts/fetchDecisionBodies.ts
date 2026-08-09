import { DecisionBody, fetchDecisionBodies } from '@/api/decisionBody';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';
import { createDB } from '@/database/kyselyDb';
import { upsertDecisionBodies } from '@/database/queries/decisionBodies';

async function main() {
  const bodies: Record<number, DecisionBody> = {};

  for (let termId = 0; termId <= CURRENT_COUNCIL_TERM; termId++) {
    console.log('fetching for', termId);
    const thisTermBodies = await fetchDecisionBodies({ termId });
    console.log(`got ${Object.values(thisTermBodies).length} values`);
    Object.assign(bodies, thisTermBodies);
  }

  const bodyList = Object.values(bodies);
  const db = createDB();
  await upsertDecisionBodies(db, bodyList);
  console.log(`Upserted ${bodyList.length} decision bodies into the database`);
}

main()
  .then(() => console.log('Decision bodies updated successfully!'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
