import { DecisionBody } from '@/api/decisionBody';

const MAX_TERM_ID = 50;

/**
 * Returns the council term in effect at `now`: the newest term among the
 * decision bodies whose start date has passed. A new term takes over on its
 * start date once its decision bodies are fetched, with no code change.
 */
export function getCurrentTermId(
  decisionBodies: Record<number, DecisionBody>,
  now: number = Date.now(),
): number | undefined {
  let currentTermId: number | undefined;
  for (const body of Object.values(decisionBodies)) {
    if (body.term.trmStartDate > now) continue;
    if (currentTermId === undefined || body.termId > currentTermId) {
      currentTermId = body.termId;
    }
  }
  return currentTermId;
}

/**
 * Fetches decision bodies for every council term the City has. Some terms
 * have none (0-2 and 5 as of 2026), so only stop after two empty terms in a
 * row once bodies have been found. Later terms overwrite earlier ones for the
 * same decisionBodyId.
 */
export async function fetchDecisionBodiesForAllTerms(
  fetchTerm: (termId: number) => Promise<Record<number, DecisionBody>>,
): Promise<Record<number, DecisionBody>> {
  const bodies: Record<number, DecisionBody> = {};
  let foundBodies = false;
  let emptyTermsInARow = 0;
  for (
    let termId = 0;
    termId <= MAX_TERM_ID && emptyTermsInARow < 2;
    termId++
  ) {
    const termBodies = await fetchTerm(termId);
    if (Object.keys(termBodies).length > 0) {
      foundBodies = true;
      emptyTermsInARow = 0;
    } else if (foundBodies) {
      emptyTermsInARow++;
    }
    Object.assign(bodies, termBodies);
  }
  return bodies;
}
