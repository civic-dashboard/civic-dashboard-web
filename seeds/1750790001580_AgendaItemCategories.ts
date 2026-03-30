import type { Kysely } from 'kysely';

export async function seed(db: Kysely<any>): Promise<void> {
  // Performs a full backfill of categories based on existing subject terms.
  // This ensures that all existing agenda items are correctly categorized.
  const result = await db
    .insertInto('AgendaItemCategories')
    .expression((eb) =>
      eb
        .selectFrom('AgendaItemSubjectTerms as atst')
        .innerJoin('TagCategories as tc', 'atst.subjectTermSlug', 'tc.tagSlug')
        .select(['atst.agendaItemId', 'tc.category'])
        .distinct(),
    )
    .onConflict((oc) => oc.columns(['agendaItemId', 'category']).doNothing())
    .executeTakeFirst();

  console.log(
    `Backfilled ${result.numInsertedOrUpdatedRows ?? 0} agenda item categories.`,
  );
}
