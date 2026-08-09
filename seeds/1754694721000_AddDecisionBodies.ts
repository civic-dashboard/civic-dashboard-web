import type { Kysely } from 'kysely';
import fs from 'fs';

export async function seed(db: Kysely<any>): Promise<void> {
  const rawData = fs.readFileSync('seeds/decision_bodies.json', 'utf-8');
  const rows = JSON.parse(rawData);

  const BATCH_SIZE = 100;
  let upserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await db
      .insertInto('DecisionBodies')
      .values(batch)
      .onConflict((oc) =>
        oc.column('decisionBodyId').doUpdateSet((eb) => ({
          committeeCodeId: eb.ref('excluded.committeeCodeId'),
          termId: eb.ref('excluded.termId'),
          decisionBodyName: eb.ref('excluded.decisionBodyName'),
          email: eb.ref('excluded.email'),
          duties: eb.ref('excluded.duties'),
          dbdyStatusCd: eb.ref('excluded.dbdyStatusCd'),
          phoneAreaCode: eb.ref('excluded.phoneAreaCode'),
          phoneNumber: eb.ref('excluded.phoneNumber'),
          faxAreaCode: eb.ref('excluded.faxAreaCode'),
          faxNumber: eb.ref('excluded.faxNumber'),
          webpostInd: eb.ref('excluded.webpostInd'),
          contactFirstName: eb.ref('excluded.contactFirstName'),
          contactLastName: eb.ref('excluded.contactLastName'),
          generalAddress: eb.ref('excluded.generalAddress'),
          decisionBodyPublishLabelCd: eb.ref(
            'excluded.decisionBodyPublishLabelCd',
          ),
          committeeCode: eb.ref('excluded.committeeCode'),
          tier: eb.ref('excluded.tier'),
          termType: eb.ref('excluded.termType'),
          trmStartDate: eb.ref('excluded.trmStartDate'),
          trmEndDate: eb.ref('excluded.trmEndDate'),
          members: eb.ref('excluded.members'),
        })),
      )
      .execute();
    upserted += batch.length;
  }

  console.log(`Seeded ${upserted} decision bodies successfully`);
}
