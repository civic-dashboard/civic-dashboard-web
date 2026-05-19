import fs from 'fs';
import path from 'path';
import { toSlug } from '@/logic/toSlug';
import { processSubjectTerms } from '@/database/pipelines/textParseUtils';

async function main() {
  const csvPath = path.join(process.cwd(), 'ml', 'output', 'all_terms.csv');
  const outputPath = path.join(process.cwd(), 'seeds', 'categories_tags.json');

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: ${csvPath} not found.`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const lines = fileContent.split('\n');
  const header = lines[0].split(',');

  // Identify column indices
  const subjectTermIdx = header.indexOf('subject_term');
  const maxCatIdx = header.indexOf('max_cat');

  if (subjectTermIdx === -1 || maxCatIdx === -1) {
    console.error('Error: Could not find required columns in all_terms.csv');
    process.exit(1);
  }

  const result = [];
  const seenNormalized = new Set<string>();

  // Skip header and empty lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, but handle potential quoted values if necessary.
    const columns = line.split(',');

    const rawTerm = columns[subjectTermIdx];
    if (!rawTerm) continue;

    // Use app logic to explode and normalize terms
    const processedTerms = processSubjectTerms(rawTerm);

    for (const term of processedTerms) {
      const normalizedKey = term.normalized.toLowerCase();

      if (seenNormalized.has(normalizedKey)) continue;
      seenNormalized.add(normalizedKey);

      const category = columns[maxCatIdx];

      result.push({
        tagRaw: term.raw,
        category: category,
        tagNormalized: term.normalized,
        tagSlug: toSlug(term.normalized),
      });
    }
  }

  // Sort by tagRaw for consistency with the original file
  result.sort((a, b) => a.tagRaw.localeCompare(b.tagRaw));

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Successfully generated ${outputPath}`);
  console.log(`Generated ${result.length} tag entries.`);
}

main().catch((err) => {
  console.error('Error executing script:', err);
  process.exit(1);
});
