import type { Kysely } from 'kysely';

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto('AgendaItemCategories')
    .expression((eb) =>
      eb
        .selectFrom('AgendaItemSubjectTerms as atst')
        .innerJoin('TagCategories as tc', 'atst.subjectTermSlug', 'tc.tagSlug')
        .select(['atst.agendaItemId', 'tc.category']),
    )
    .onConflict((oc) => oc.columns(['agendaItemId', 'category']).doNothing())
    .execute();
}
