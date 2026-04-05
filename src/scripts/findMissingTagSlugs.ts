/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDB } from '@/database/kyselyDb';
import fs from 'fs';
import path from 'path';

async function main() {
  const db = createDB();

  try {
    const subjectTerms = await db
      .selectFrom('AgendaItemSubjectTerms')
      .select('subjectTermRaw')
      .distinct()
      .execute();

    const subjectRaws = subjectTerms
      .map((row) => row.subjectTermRaw.toLowerCase())
      .filter((term): term is string => !!term);

    const categoriesPath = path.join(
      process.cwd(),
      'seeds',
      'categories_tags.json',
    );
    const fileContent = fs.readFileSync(categoriesPath, 'utf8');
    const categoriesData = JSON.parse(fileContent);
    const tagRaws = new Set(
      categoriesData.map((item: any) => item.tagRaw.toLowerCase()),
    );

    const missingRaws = subjectRaws.filter((term) => !tagRaws.has(term));

    console.log(
      `Found ${missingRaws.length} subject term names from the database that are not in seeds/categories_tags.json (TagCategories):`,
    );
    for (const term of missingRaws.sort()) {
      console.log(term);
    }
  } catch (error) {
    console.error('Error running script:', error);
  } finally {
    process.exit(0);
  }
}

main();
