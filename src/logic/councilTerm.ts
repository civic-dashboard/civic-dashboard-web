import { DecisionBody } from '@/api/decisionBody';

const MAX_TERM_ID = 50;

/**
 * Returns the council term in effect at `now`: the newest term that has
 * started and has at least one committee with members. City Council is
 * skipped because it is published before committee members are appointed,
 * so the previous term stays current while the new one is partly loaded.
 *
 * The City's API removes members once appointments end, so there can be a
 * gap where no term has members (term 8 appointments end before term 9's
 * are made). In that case it falls back to the newest term that has started,
 * so the /actions filter doesn't go empty.
 */
export function getCurrentTermId(
  decisionBodies: Record<number, DecisionBody>,
  now: number = Date.now(),
): number | undefined {
  let newestStarted: number | undefined;
  let newestWithMembers: number | undefined;
  for (const body of Object.values(decisionBodies)) {
    if (body.term.trmStartDate > now) continue;
    newestStarted = Math.max(newestStarted ?? body.termId, body.termId);
    if (body.decisionBodyPublishLabelCd === 'COUNCIL' || !body.members?.length)
      continue;
    newestWithMembers = Math.max(newestWithMembers ?? body.termId, body.termId);
  }
  return newestWithMembers ?? newestStarted;
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
