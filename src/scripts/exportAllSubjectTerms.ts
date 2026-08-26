// Dumps all subject terms from every agenda item in the database into a txt file.
//
// When `--all` is specified, all subject terms are included. Otherwise, only
// subject terms that do not have a category and are not marked "Uncategorizable" will be returned.
//
// Usage:
//  npm run tsxe src/scripts/exportAllSubjectTerms.ts <output.txt>
//  npm run tsxe src/scripts/exportAllSubjectTerms.ts <output.txt> -- --all
import { createDB } from '@/database/kyselyDb';
import { normalizeSubjectTerms } from '@/database/queries/agendaItems';
import fs from 'fs';
import { argv } from 'process';

async function fetchAllSubjectTerms(exportAll: boolean): Promise<Set<string>> {
  const db = createDB();
  const batchSize = 2500;
  let offset = 0;
  const uniqueTerms = new Set<string>();

  // If exportAll is false, fetch slugs already in TagCategories so we can skip them
  let existingSlugs: Set<string> | null = null;
  if (!exportAll) {
    console.log(`Skipping all previously categorized subject terms`);
    const existing = await db
      .selectFrom('TagCategories')
      .select('tagSlug')
      .execute();
    existingSlugs = new Set(existing.map((r) => r.tagSlug));
    console.log(`Found ${existingSlugs.size} already-processed term slugs`);
  }

  console.log('Fetching and normalizing subject terms from database...');

  while (true) {
    const agendaItemRecords = await db
      .selectFrom('RawAgendaItemConsiderations')
      .select(['agendaItemId', 'subjectTerms'])
      .limit(batchSize)
      .offset(offset)
      .orderBy('agendaItemId')
      .execute();

    if (agendaItemRecords.length === 0) break;

    const normalizedResults = normalizeSubjectTerms(agendaItemRecords);

    for (const term of normalizedResults) {
      if (existingSlugs?.has(term.subjectTermSlug)) continue;
      uniqueTerms.add(term.subjectTermRaw); // Ensures we only capture each subject term once
    }

    offset += batchSize;
    console.log(`Processed ${offset} rows...`);
  }

  await db
    .destroy()
    .catch((err) => console.error('Failed to destroy DB connection:', err));

  return uniqueTerms;
}

async function main() {
  const args = argv.slice(2);

  let exportAll = false;
  const positionals: string[] = [];

  for (const arg of args) {
    if (arg === '--all') {
      exportAll = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown flag: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }

  const outputPath = positionals[0];

  if (!outputPath) {
    console.error(
      'Usage: npm run tsxe src/scripts/exportAllSubjectTerms.ts [--all] <output.txt>',
    );
    process.exit(1);
  }

  const allTerms = await fetchAllSubjectTerms(exportAll);

  const sortedTerms = Array.from(allTerms).sort();

  fs.writeFileSync(outputPath, sortedTerms.join('\n'));

  console.log(
    `Successfully exported ${sortedTerms.length} unique subject terms to ${outputPath}`,
  );
}

main().catch((err) => {
  console.error('Error executing script:', err);
  process.exit(1);
});
