/**
 * Parses the ML categorization CSV output into a more consumable JSON format.
 * [{
 *   "category": string,
 *   "tagRaw": string,
 *   "tagNormalized": string,
 *   "tagSlug": string
 *  }, ...]
 *
 * Usage:
 *   npm run tsx src/scripts/generateCategoryMapping.ts <categories.json> <input.csv> <output.json>
 */

import fs from 'fs';
import { parse } from 'csv-parse';
import { argv } from 'process';
import { toSlug } from '@/logic/toSlug';
import { processSubjectTerms } from '@/database/pipelines/textParseUtils';

type Category = {
  name: string;
  description: string;
};

type CategoryMappingEntry = {
  tagRaw: string;
  category: string;
  tagNormalized: string;
  tagSlug: string;
};

type CsvRow = {
  subject_term: string;
  max_cat: string;
};

/**
 * Parse the categorization CSV into category mapping entries.
 *
 * Validates each record's category against the canonical set,
 * explodes/normalizes subject terms, deduplicates, and returns sorted entries.
 */
export function buildCategoryMapping(
  records: CsvRow[],
  validCategories: Set<string>,
  onInvalidCategory?: (term: string, category: string) => void,
): CategoryMappingEntry[] {
  const result: CategoryMappingEntry[] = [];
  const seenNormalized = new Set<string>();

  for (const { subject_term: rawTerm, max_cat: category } of records) {
    if (!rawTerm) continue;

    if (!validCategories.has(category)) {
      onInvalidCategory?.(rawTerm, category);
      continue;
    }

    const processedTerms = processSubjectTerms(rawTerm);

    for (const term of processedTerms) {
      const normalizedKey = term.normalized.toLowerCase();

      if (seenNormalized.has(normalizedKey)) continue;
      seenNormalized.add(normalizedKey);

      result.push({
        tagRaw: term.raw,
        category: category,
        tagNormalized: term.normalized,
        tagSlug: toSlug(term.normalized),
      });
    }
  }

  result.sort((a, b) => a.tagRaw.localeCompare(b.tagRaw));
  return result;
}

/**
 * Read the categorization CSV and write the category mapping JSON.
 */
async function generateCategoryMappingFile(
  categoriesPath: string,
  csvPath: string,
  outputPath: string,
): Promise<void> {
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: ${csvPath} not found.`);
    process.exit(1);
  }

  if (!fs.existsSync(categoriesPath)) {
    console.error(`Error: ${categoriesPath} not found.`);
    process.exit(1);
  }

  // Load canonical categories directly from categories.json
  const categoriesJson = JSON.parse(
    fs.readFileSync(categoriesPath, 'utf-8'),
  ) as Category[];
  const validCategories = new Set(categoriesJson.map((c) => c.name));

  // Parse CSV
  const records: CsvRow[] = [];
  const stream = parse(fs.readFileSync(csvPath), {
    columns: true,
  });
  for await (const record of stream) {
    records.push(record);
  }

  // Core transformation
  let skippedInvalid = 0;
  const result = buildCategoryMapping(records, validCategories, () => {
    skippedInvalid++;
  });

  // Write output
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Successfully generated ${outputPath}`);
  console.log(`Generated ${result.length} category mapping entries.`);
  if (skippedInvalid > 0) {
    console.warn(`Skipped ${skippedInvalid} term(s) with invalid categories.`);
  }
}

async function main() {
  const [categoriesPath, csvPath, outputPath] = argv.slice(2);

  if (!categoriesPath || !csvPath || !outputPath) {
    console.error(
      'Usage: npm run tsx src/scripts/generateCategoryMapping.ts <categories.json> <input.csv> <output.json>',
    );
    process.exit(1);
  }

  await generateCategoryMappingFile(categoriesPath, csvPath, outputPath);
}

main().catch((err) => {
  console.error('Error executing script:', err);
  process.exit(1);
});
