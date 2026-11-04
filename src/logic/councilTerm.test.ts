import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DecisionBody } from '@/api/decisionBody';
import {
  fetchDecisionBodiesForAllTerms,
  getCurrentTermId,
} from '@/logic/councilTerm';

const TERM_8_START = Date.parse('2022-11-15T05:00:00Z');
const TERM_9_START = Date.parse('2026-11-15T05:00:00Z');

const body = (
  decisionBodyId: number,
  termId: number,
  trmStartDate: number,
): DecisionBody =>
  ({
    decisionBodyId,
    termId,
    decisionBodyName: `Body ${decisionBodyId}`,
    term: { termId, trmStartDate },
  }) as DecisionBody;

const byId = (...bodies: DecisionBody[]) =>
  Object.fromEntries(bodies.map((b) => [b.decisionBodyId, b]));

describe('getCurrentTermId', () => {
  const bodies = byId(
    body(1862, 7, Date.parse('2018-12-01T05:00:00Z')),
    body(2462, 8, TERM_8_START),
    body(3000, 9, TERM_9_START),
  );

  it('ignores a term that has not started yet', () => {
    assert.equal(getCurrentTermId(bodies, TERM_9_START - 1), 8);
  });

  it('switches to the new term on its start date', () => {
    assert.equal(getCurrentTermId(bodies, TERM_9_START), 9);
  });

  it('returns undefined when there are no decision bodies', () => {
    assert.equal(getCurrentTermId({}), undefined);
  });
});

describe('fetchDecisionBodiesForAllTerms', () => {
  // Number of decision bodies per term from the Oct 25, 2026 workflow run.
  const OCT_2026_COUNTS: Record<number, number> = {
    3: 38,
    4: 67,
    6: 81,
    7: 73,
    8: 76,
  };

  const fakeApi = (counts: Record<number, number>) => {
    const fetchedTerms: number[] = [];
    const fetchTerm = async (termId: number) => {
      fetchedTerms.push(termId);
      const bodies = Array.from({ length: counts[termId] ?? 0 }, (_, i) =>
        body(termId * 1000 + i, termId, 0),
      );
      return byId(...bodies);
    };
    return { fetchTerm, fetchedTerms };
  };

  it('fetches past the empty term 5 and stops after two empty terms', async () => {
    const { fetchTerm, fetchedTerms } = fakeApi(OCT_2026_COUNTS);
    const bodies = await fetchDecisionBodiesForAllTerms(fetchTerm);

    assert.deepEqual(fetchedTerms, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.equal(Object.keys(bodies).length, 38 + 67 + 81 + 73 + 76);
  });

  it('picks up a new term without a code change', async () => {
    const { fetchTerm, fetchedTerms } = fakeApi({ ...OCT_2026_COUNTS, 9: 40 });
    const bodies = await fetchDecisionBodiesForAllTerms(fetchTerm);

    assert.equal(fetchedTerms.at(-1), 11);
    assert.equal(
      Object.values(bodies).filter((b) => b.termId === 9).length,
      40,
    );
  });

  it('stops at the cap when the API returns nothing', async () => {
    const { fetchTerm, fetchedTerms } = fakeApi({});
    const bodies = await fetchDecisionBodiesForAllTerms(fetchTerm);

    assert.equal(fetchedTerms.length, 51);
    assert.deepEqual(bodies, {});
  });

  it('lets a later term overwrite the same decisionBodyId', async () => {
    const fetchTerm = async (termId: number) =>
      termId === 3 || termId === 4 ? byId(body(42, termId, 0)) : {};
    const bodies = await fetchDecisionBodiesForAllTerms(fetchTerm);

    assert.equal(bodies[42].termId, 4);
  });
});
