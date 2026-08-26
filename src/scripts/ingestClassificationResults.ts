// Ingests ML classification results into the database.
//
// Invoked by a GHA workflow to insert the output from generateCategoryMapping.ts
// into the database.
//
// Usage:
//   npm run tsxe src/scripts/ingestClassificationResults.ts <subject_term_category_mapping.json>

import { readFile } from 'fs/promises';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { createDB } from '@/database/kyselyDb';
import { updateAgendaItemCategories } from '@/database/queries/agendaItems';

type CategoryMappingEntry = {
  tagRaw: string;
  category: string;
  tagNormalized: string;
  tagSlug: string;
};

type IngestionResult = {
  insertedCount: number;
  agendaItemIds: number[];
};

async function parseCategoryMappingJson(
  jsonPath: string,
): Promise<CategoryMappingEntry[]> {
  const data = JSON.parse(
    await readFile(jsonPath, 'utf8'),
  ) as CategoryMappingEntry[];
  console.log(
    `Loaded ${data.length} category mapping entries from ${jsonPath}`,
  );
  return data;
}

/**
 * Replaces TagCategories entries for the given slugs with the new set.
 */
async function upsertTagCategories(
  db: Kysely<DB>,
  entries: CategoryMappingEntry[],
): Promise<void> {
  const slugs = entries.map((e) => e.tagSlug);

  await db.deleteFrom('TagCategories').where('tagSlug', 'in', slugs).execute();
  await db.insertInto('TagCategories').values(entries).execute();

  console.log(`Replaced ${entries.length} TagCategories rows`);
}

/**
 * Queries AgendaItemSubjectTerms for agenda items that have any of the
 * given subject term slugs, then refreshes their AgendaItemCategories.
 */
async function refreshAgendaItemCategories(
  db: Kysely<DB>,
  slugs: string[],
): Promise<number[]> {
  const agendaItemRows = await db
    .selectFrom('AgendaItemSubjectTerms')
    .select('agendaItemId')
    .where('subjectTermSlug', 'in', slugs)
    .distinct()
    .execute();

  const agendaItemIds = agendaItemRows.map((r) => r.agendaItemId);
  console.log(`Found ${agendaItemIds.length} agenda items to update`);

  if (agendaItemIds.length > 0) {
    const updatedCount = await updateAgendaItemCategories(db, agendaItemIds);
    console.log(
      `Updated AgendaItemCategories for ${updatedCount} agenda item→category mappings`,
    );
  }

  return agendaItemIds;
}

/**
 * Core ingestion logic. Upserts category mapping entries into TagCategories,
 * and refreshes AgendaItemCategories for affected agenda items.
 */
export async function ingestClassificationResults(
  db: Kysely<DB>,
  mappingEntries: CategoryMappingEntry[],
): Promise<IngestionResult> {
  if (mappingEntries.length === 0) {
    console.log('No entries to insert.');
    return { insertedCount: 0, agendaItemIds: [] };
  }

  console.log(
    `Prepared ${mappingEntries.length} term→category mappings for insertion`,
  );

  await upsertTagCategories(db, mappingEntries);

  const slugs = mappingEntries.map((e) => e.tagSlug);
  const agendaItemIds = await refreshAgendaItemCategories(db, slugs);

  console.log('');
  console.log('── Ingestion Summary ──');
  console.log(`  Subject terms updated:   ${mappingEntries.length}`);
  console.log(`  Agenda items updated:    ${agendaItemIds.length}`);

  return { insertedCount: mappingEntries.length, agendaItemIds };
}

async function main() {
  const [mappingPath] = process.argv.slice(2);

  if (!mappingPath) {
    console.error(
      'Usage: npm run tsxe src/scripts/ingestClassificationResults.ts <subject_term_category_mapping.json>',
    );
    process.exit(1);
  }

  const mappingEntries = await parseCategoryMappingJson(mappingPath);

  const db = createDB();
  try {
    await ingestClassificationResults(db, mappingEntries);
  } finally {
    await db
      .destroy()
      .catch((err) => console.error('Failed to destroy DB connection:', err));
  }
}

main().catch((err) => {
  console.error('Error during ingestion:', err);
  process.exit(1);
});
