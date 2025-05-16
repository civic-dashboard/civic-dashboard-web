import type { Kysely } from 'kysely';
import fs from 'fs';
export async function seed(db: Kysely<any>): Promise<void> {
  try {
    const rawData = fs.readFileSync('seeds/categories_tags.json', 'utf-8');
    const jsonData = JSON.parse(rawData);

    await db.deleteFrom('TagCategories').execute();
    await db.insertInto('TagCategories').values(jsonData).execute();
    console.log('Seeded TagCategories table successfully');
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
}
