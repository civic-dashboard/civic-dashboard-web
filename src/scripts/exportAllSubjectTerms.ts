//can be executed by calling: npm run tsxe src/scripts/tag-exportSubjectTerms.ts
//This gets all the subject terms from TMMIS saved in our database and
//creates a .txt file that we can then use to put into the notebook to assign to categories
import { createDB } from '@/database/kyselyDb';
import { normalizeSubjectTerms } from '@/database/queries/agendaItems';
import fs from 'fs';
import { argv } from 'process';

async function fetchAllSubjectTerms(): Promise<Set<string>> {
  const db = createDB();
  const batchSize = 2500;
  let offset = 0;
  const uniqueTerms = new Set<string>();

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

    // Discard any previously seen terms based on raw form
    for (const term of normalizedResults) {
      uniqueTerms.add(term.subjectTermRaw);
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
  const [outputPath] = argv.slice(2);

  if (!outputPath) {
    console.error(
      'Usage: npm run tsx src/scripts/exportAllSubjectTerms.ts <output.txt>',
    );
  }

  const allTerms = await fetchAllSubjectTerms();

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
