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

type SkippedEntry = {
  term: string;
  category: string;
  slug: string;
};

type BuildCategoryMappingResult = {
  entries: CategoryMappingEntry[];
  skippedInvalid: SkippedEntry[];
  duplicates: SkippedEntry[];
};

/**
 * Parse the categorization CSV into category mapping entries.
 *
 * Validates each record's category against the canonical set,
 * explodes/normalizes subject terms, deduplicates, and returns sorted entries
 * along with any skipped records.
 *
 * Deduplication is on (category, tagSlug) to match the DB unique index
 * idx_category_tag. Two terms can normalize differently but slugify
 * to the same value (e.g. "metis" and "métis" → "metis"), so
 * deduping on normalized text alone is insufficient. In future, we should
 * attempt to deduplicate prior to classification.
 */
export function buildCategoryMapping(
  records: CsvRow[],
  validCategories: Set<string>,
): BuildCategoryMappingResult {
  const entries: CategoryMappingEntry[] = [];
  const skippedInvalid: SkippedEntry[] = [];
  const duplicates: SkippedEntry[] = [];
  const seenCategorySlug = new Set<string>();

  for (const { subject_term: rawTerm, max_cat: category } of records) {
    if (!rawTerm) continue;

    if (!validCategories.has(category)) {
      skippedInvalid.push({ term: rawTerm, category, slug: '' });
      continue;
    }

    const processedTerms = processSubjectTerms(rawTerm);

    for (const term of processedTerms) {
      const slug = toSlug(term.normalized);
      const dedupKey = `${category}\0${slug}`;

      if (seenCategorySlug.has(dedupKey)) {
        duplicates.push({ term: term.raw, category, slug });
        continue;
      }
      seenCategorySlug.add(dedupKey);

      entries.push({
        tagRaw: term.raw,
        category: category,
        tagNormalized: term.normalized,
        tagSlug: slug,
      });
    }
  }

  entries.sort((a, b) => a.tagRaw.localeCompare(b.tagRaw));
  return { entries, skippedInvalid, duplicates };
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
  const { entries, skippedInvalid, duplicates } = buildCategoryMapping(
    records,
    validCategories,
  );

  // Write output
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Successfully generated ${outputPath}`);
  console.log(`Generated ${entries.length} category mapping entries.`);
  if (skippedInvalid.length > 0) {
    console.warn(
      `Skipped ${skippedInvalid.length} term(s) with invalid categories.`,
    );
  }
  if (duplicates.length > 0) {
    console.warn(
      `Skipped ${duplicates.length} duplicate(s) on (category, tagSlug).`,
    );
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
