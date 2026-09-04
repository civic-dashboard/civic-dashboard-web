//can be executed by calling: npm run tsxe src/scripts/tag-exportSubjectTerms.ts
//This gets all the subject terms from TMMIS saved in our database and
//creates a .txt file that we can then use to put into the notebook to assign to categories
import { createDB } from '@/database/kyselyDb';
import { normalizeSubjectTerms } from '@/database/queries/agendaItems';
import fs from 'fs';

async function main() {
  const db = createDB();
  const batchSize = 2500;
  let offset = 0;
  let hasMore = true;
  const uniqueTerms = new Set<string>();

  console.log('Fetching and normalizing subject terms from database...');

  while (hasMore) {
    const agendaItemRecords = await db
      .selectFrom('RawAgendaItemConsiderations')
      .select(['agendaItemId', 'subjectTerms'])
      .limit(batchSize)
      .offset(offset)
      .orderBy('agendaItemId')
      .execute();

    hasMore = agendaItemRecords.length > 0;
    if (!hasMore) break;

    const normalizedResults = normalizeSubjectTerms(agendaItemRecords);

    for (const term of normalizedResults) {
      uniqueTerms.add(term.subjectTermRaw);
    }

    offset += batchSize;
    console.log(`Processed ${offset} rows...`);
  }

  const sortedTerms = Array.from(uniqueTerms).sort();
  fs.writeFileSync('ml/input/subject_terms.txt', sortedTerms.join('\n'));

  console.log(
    `Successfully exported ${sortedTerms.length} unique raw terms to ml/input/subject_terms.txt`,
  );
  await db
    .destroy()
    .catch((err) => console.error('Failed to destroy DB connection:', err));
}

main().catch((err) => {
  console.error('Error executing script:', err);
  process.exit(1);
});
