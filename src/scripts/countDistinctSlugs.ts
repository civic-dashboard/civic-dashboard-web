/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDB } from '@/database/kyselyDb';
import fs from 'fs';
import path from 'path';

async function main() {
  const db = createDB();

  try {
    // 1. All distinct raw names from DB
    const dbResult = await db
      .selectFrom('AgendaItemSubjectTerms')
      .select('subjectTermRaw')
      .distinct()
      .execute();
    const dbCount = new Set(
      dbResult.map((row) => row.subjectTermRaw.toLowerCase()),
    ).size;

    // 2. All distinct tagRaw from JSON
    const categoriesPath = path.join(
      process.cwd(),
      'seeds',
      'categories_tags.json',
    );
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const jsonCount = new Set(
      categoriesData.map((item: any) => item.tagRaw.toLowerCase()),
    ).size;

    console.log('--- Statistics ---');
    console.log(`Distinct tagRaws in categories_tags.json: ${jsonCount}`);
    console.log(
      `Distinct subjectTermRaws in AgendaItemSubjectTerms: ${dbCount}`,
    );
    console.log('------------------');
  } catch (error) {
    console.error('Error running count script:', error);
  } finally {
    process.exit(0);
  }
}

main();
