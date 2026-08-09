import { DecisionBody, Member } from '@/api/decisionBody';
import { DB, DecisionBodies, Json } from '@/database/allDbTypes';
import { Insertable, Kysely, Selectable } from 'kysely';

export type DecisionBodyRow = Selectable<DecisionBodies>;
export type InsertDecisionBody = Insertable<DecisionBodies>;

const BATCH_SIZE = 100;

export const toDecisionBodyRow = (body: DecisionBody): InsertDecisionBody => ({
  decisionBodyId: body.decisionBodyId,
  committeeCodeId: body.committeeCodeId,
  termId: body.termId,
  decisionBodyName: body.decisionBodyName,
  email: body.email ?? null,
  duties: body.duties ?? null,
  dbdyStatusCd: body.dbdyStatusCd,
  phoneAreaCode: body.phoneAreaCode ?? null,
  phoneNumber: body.phoneNumber ?? null,
  faxAreaCode: body.faxAreaCode ?? null,
  faxNumber: body.faxNumber ?? null,
  webpostInd: body.webpostInd,
  contactFirstName: body.contactFirstName ?? null,
  contactLastName: body.contactLastName ?? null,
  generalAddress: body.generalAddress ?? null,
  decisionBodyPublishLabelCd: body.decisionBodyPublishLabelCd,
  committeeCode: body.committeeCode.committeeCode,
  tier: body.decisionBodyType.tier,
  termType: body.term.termType,
  trmStartDate: body.term.trmStartDate,
  trmEndDate: body.term.trmEndDate,
  members: body.members as unknown as Json,
});

export const toDecisionBody = (row: DecisionBodyRow): DecisionBody => {
  const body: DecisionBody = {
    decisionBodyId: row.decisionBodyId,
    committeeCodeId: row.committeeCodeId,
    termId: row.termId,
    decisionBodyName: row.decisionBodyName,
    dbdyStatusCd: row.dbdyStatusCd,
    webpostInd: row.webpostInd,
    decisionBodyPublishLabelCd: row.decisionBodyPublishLabelCd,
    committeeCode: {
      committeeCodeId: row.committeeCodeId,
      committeeCode: row.committeeCode,
    },
    decisionBodyType: {
      tier: row.tier,
    },
    term: {
      termId: row.termId,
      termType: row.termType,
      trmStartDate: parseInt(row.trmStartDate, 10),
      trmEndDate: parseInt(row.trmEndDate, 10),
    },
    members: row.members as unknown as Member[],
  };

  if (row.email != null) body.email = row.email;
  if (row.duties != null) body.duties = row.duties;
  if (row.phoneAreaCode != null) body.phoneAreaCode = row.phoneAreaCode;
  if (row.phoneNumber != null) body.phoneNumber = row.phoneNumber;
  if (row.faxAreaCode != null) body.faxAreaCode = row.faxAreaCode;
  if (row.faxNumber != null) body.faxNumber = row.faxNumber;
  if (row.contactFirstName != null)
    body.contactFirstName = row.contactFirstName;
  if (row.contactLastName != null) body.contactLastName = row.contactLastName;
  if (row.generalAddress != null) body.generalAddress = row.generalAddress;

  return body;
};

const decisionBodyConflictColumns = [
  'committeeCodeId',
  'termId',
  'decisionBodyName',
  'email',
  'duties',
  'dbdyStatusCd',
  'phoneAreaCode',
  'phoneNumber',
  'faxAreaCode',
  'faxNumber',
  'webpostInd',
  'contactFirstName',
  'contactLastName',
  'generalAddress',
  'decisionBodyPublishLabelCd',
  'committeeCode',
  'tier',
  'termType',
  'trmStartDate',
  'trmEndDate',
  'members',
] as const satisfies ReadonlyArray<keyof InsertDecisionBody>;

export const upsertDecisionBodies = async (
  db: Kysely<DB>,
  bodies: DecisionBody[],
) => {
  if (bodies.length === 0) {
    return;
  }

  const rows = bodies.map(toDecisionBodyRow);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await db
      .insertInto('DecisionBodies')
      .values(batch)
      .onConflict((oc) =>
        oc
          .column('decisionBodyId')
          .doUpdateSet((eb) =>
            Object.fromEntries(
              decisionBodyConflictColumns.map((column) => [
                column,
                eb.ref(`excluded.${column}`),
              ]),
            ),
          ),
      )
      .execute();
  }
};

export const getAllDecisionBodies = async (
  db: Kysely<DB>,
): Promise<Record<number, DecisionBody>> => {
  const rows = await db.selectFrom('DecisionBodies').selectAll().execute();
  return Object.fromEntries(
    rows.map((row) => [row.decisionBodyId, toDecisionBody(row)]),
  );
};

export const getDecisionBodiesByTerm = async (
  db: Kysely<DB>,
  termId: number,
): Promise<Record<number, DecisionBody>> => {
  const rows = await db
    .selectFrom('DecisionBodies')
    .selectAll()
    .where('termId', '=', termId)
    .execute();
  return Object.fromEntries(
    rows.map((row) => [row.decisionBodyId, toDecisionBody(row)]),
  );
};

export const getDecisionBodyById = async (
  db: Kysely<DB>,
  decisionBodyId: number,
): Promise<DecisionBody | undefined> => {
  const row = await db
    .selectFrom('DecisionBodies')
    .selectAll()
    .where('decisionBodyId', '=', decisionBodyId)
    .executeTakeFirst();
  return row ? toDecisionBody(row) : undefined;
};
