// Ingests ML classification results into the database.
//
// Invoked by a GHA workflow after the Modal classification app produces
// classified_terms.csv. Reads two file inputs:
//   - new_terms.json        - terms from detectNewSubjectTerms.ts (#486)
//   - classified_terms.csv  - Modal app output with subject_term + max_cat
//
// Usage:
//   npm run tsxe src/scripts/ingestClassificationResults.ts \
//     ml/output/new_terms.json \
//     ml/output/classified_terms.csv

import { readFile } from 'fs/promises';
import { parse } from 'csv-parse';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { createDB } from '@/database/kyselyDb';
import { updateAgendaItemCategories } from '@/database/queries/agendaItems';
import { processSubjectTerms } from '@/database/pipelines/textParseUtils';
import { toSlug } from '@/logic/toSlug';

type NewTermsFile = {
  reclassify: string;
  terms: {
    subjectTermRaw: string;
    subjectTermNormalized: string;
    subjectTermSlug: string;
  }[];
};

type ClassifiedRow = {
  subject_term: string;
  max_cat: string;
};

type TagCategoryEntry = {
  tagRaw: string;
  tagNormalized: string;
  tagSlug: string;
  category: string;
};

type IngestionResult = {
  insertedCount: number;
  agendaItemIds: number[];
};

async function parseNewTermsJson(jsonPath: string): Promise<NewTermsFile> {
  const data = JSON.parse(await readFile(jsonPath, 'utf8')) as NewTermsFile;
  console.log(`Loaded ${data.terms.length} terms from ${jsonPath}`);
  return data;
}

async function parseClassifiedCsv(csvPath: string): Promise<ClassifiedRow[]> {
  const rows: ClassifiedRow[] = [];
  const parser = parse(await readFile(csvPath), { columns: true });
  for await (const row of parser) {
    if (!row.subject_term || !row.max_cat) continue;
    rows.push({ subject_term: row.subject_term, max_cat: row.max_cat });
  }
  console.log(`Loaded ${rows.length} classified rows from ${csvPath}`);
  return rows;
}

/**
 * Normalizes classified CSV rows into TagCategories entries, filtered to
 * only terms that were part of the classification batch (per new_terms.json).
 * Logs an error for any classified term not found in the batch.
 */
function buildTagCategoryEntries(
  newTerms: NewTermsFile,
  classifiedRows: ClassifiedRow[],
): TagCategoryEntry[] {
  const termsBySlug = new Map<string, { raw: string; normalized: string }>();
  for (const term of newTerms.terms) {
    termsBySlug.set(term.subjectTermSlug, {
      raw: term.subjectTermRaw,
      normalized: term.subjectTermNormalized,
    });
  }

  const entries: TagCategoryEntry[] = [];
  const seenSlugs = new Set<string>();

  for (const row of classifiedRows) {
    const processed = processSubjectTerms(row.subject_term);
    for (const term of processed) {
      const slug = toSlug(term.normalized);
      if (!termsBySlug.has(slug)) {
        console.error(
          `Term "${row.subject_term}" (slug: ${slug}) not found in classification batch - skipping`,
        );
        continue;
      }
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      entries.push({
        tagRaw: term.raw,
        tagNormalized: term.normalized,
        tagSlug: slug,
        category: row.max_cat.trim(),
      });
    }
  }

  return entries;
}

/**
 * Replaces TagCategories entries for the given slugs with the new set.
 */
async function upsertTagCategories(
  db: Kysely<DB>,
  entries: TagCategoryEntry[],
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
 * Core ingestion logic. Replaces TagCategories entries for the batch,
 * and refreshes AgendaItemCategories for affected agenda items.
 */
export async function ingestClassificationResults(
  db: Kysely<DB>,
  newTerms: NewTermsFile,
  classifiedRows: ClassifiedRow[],
): Promise<IngestionResult> {
  const entries = buildTagCategoryEntries(newTerms, classifiedRows);

  console.log(
    `Prepared ${entries.length} term→category mappings for insertion`,
  );

  if (entries.length === 0) {
    console.log('No entries to insert.');
    return { insertedCount: 0, agendaItemIds: [] };
  }

  await upsertTagCategories(db, entries);

  const slugs = entries.map((e) => e.tagSlug);
  const agendaItemIds = await refreshAgendaItemCategories(db, slugs);

  console.log('');
  console.log('── Ingestion Summary ──');
  console.log(`  Term→category mappings inserted: ${entries.length}`);
  console.log(`  Agenda items updated:            ${agendaItemIds.length}`);

  return { insertedCount: entries.length, agendaItemIds };
}

async function main() {
  const [newTermsPath, classifiedTermsPath] = process.argv.slice(2);

  if (!newTermsPath || !classifiedTermsPath) {
    console.error(
      'Usage: npm run tsxe src/scripts/ingestClassificationResults.ts <new_terms.json> <classified_terms.csv>',
    );
    process.exit(1);
  }

  const newTermsData = await parseNewTermsJson(newTermsPath);
  const classifiedRows = await parseClassifiedCsv(classifiedTermsPath);

  const db = createDB();
  try {
    await ingestClassificationResults(db, newTermsData, classifiedRows);
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
