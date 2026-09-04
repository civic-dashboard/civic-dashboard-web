import { DecisionBody } from '@/api/decisionBody';
import { DB, Json } from '@/database/allDbTypes';
import { Kysely } from 'kysely';

/** Last write wins — Postgres rejects ON CONFLICT batches with duplicate PKs. */
const dedupeByDecisionBodyId = (bodies: DecisionBody[]): DecisionBody[] => [
  ...new Map(bodies.map((body) => [body.decisionBodyId, body])).values(),
];

export const upsertDecisionBodies = async (
  db: Kysely<DB>,
  bodies: DecisionBody[],
) => {
  const uniqueBodies = dedupeByDecisionBodyId(bodies);
  if (uniqueBodies.length === 0) return;

  const BATCH_SIZE = 50;
  for (let i = 0; i < uniqueBodies.length; i += BATCH_SIZE) {
    const batch = uniqueBodies.slice(i, i + BATCH_SIZE);
    const values = batch.map((body) => ({
      decisionBodyId: body.decisionBodyId,
      termId: body.termId,
      decisionBodyName: body.decisionBodyName,
      email: body.email ?? null,
      decisionBodyPublishLabelCd: body.decisionBodyPublishLabelCd,
      payload: body as unknown as Json,
      updatedAt: new Date(),
    }));

    await db
      .insertInto('DecisionBodies')
      .values(values)
      .onConflict((onConflict) =>
        onConflict.column('decisionBodyId').doUpdateSet({
          termId: (eb) => eb.ref('excluded.termId'),
          decisionBodyName: (eb) => eb.ref('excluded.decisionBodyName'),
          email: (eb) => eb.ref('excluded.email'),
          decisionBodyPublishLabelCd: (eb) =>
            eb.ref('excluded.decisionBodyPublishLabelCd'),
          payload: (eb) => eb.ref('excluded.payload'),
          updatedAt: (eb) => eb.ref('excluded.updatedAt'),
        }),
      )
      .execute();
  }
};

export const getDecisionBodies = async (
  db: Kysely<DB>,
): Promise<Record<number, DecisionBody>> => {
  const rows = await db
    .selectFrom('DecisionBodies')
    .select(['decisionBodyId', 'payload'])
    .execute();

  const result: Record<number, DecisionBody> = {};
  for (const row of rows) {
    result[row.decisionBodyId] = row.payload as unknown as DecisionBody;
  }
  return result;
};

export const getDecisionBody = async (
  db: Kysely<DB>,
  decisionBodyId: number,
): Promise<DecisionBody | undefined> => {
  const row = await db
    .selectFrom('DecisionBodies')
    .select('payload')
    .where('decisionBodyId', '=', decisionBodyId)
    .executeTakeFirst();

  return row?.payload as unknown as DecisionBody | undefined;
};
