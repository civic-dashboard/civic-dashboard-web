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
import { processAgendaItemSubjectTerms } from '@/database/queries/agendaItems';

type CategoryMappingEntry = {
  tagRaw: string;
  category: string;
  tagNormalized: string;
  tagSlug: string;
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
 * Core ingestion logic. Upserts category mapping entries into TagCategories,
 * then fully re-derives the subject-term and category tables.
 *
 * While this is not a very efficient implementation, it is the simplest way to
 * ensure that changes to the set of categories won't result in stale entries.
 */
export async function ingestClassificationResults(
  db: Kysely<DB>,
  mappingEntries: CategoryMappingEntry[],
): Promise<void> {
  if (mappingEntries.length === 0) {
    console.log('No entries to insert.');
    return;
  }

  console.log(
    `Prepared ${mappingEntries.length} term→category mappings for insertion`,
  );

  await upsertTagCategories(db, mappingEntries);

  console.log('');
  console.log('── Rebuilding derived tables ──');
  await processAgendaItemSubjectTerms(db);

  console.log('');
  console.log('── Ingestion Summary ──');
  console.log(`  Subject terms updated:   ${mappingEntries.length}`);
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
