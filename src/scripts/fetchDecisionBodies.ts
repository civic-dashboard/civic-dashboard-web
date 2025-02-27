import { DecisionBody, fetchDecisionBodies } from '@/api/decisionBody';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';

const bodies: Record<number, DecisionBody> = {};
for (let termId = 0; termId <= CURRENT_COUNCIL_TERM; termId++) {
  console.log('fetching for', termId);
  const thisTermBodies = await fetchDecisionBodies({ termId });
  console.log(`got ${Object.values(thisTermBodies).length} values`);
  Object.assign(bodies, thisTermBodies);
}

console.log(JSON.stringify(bodies));
