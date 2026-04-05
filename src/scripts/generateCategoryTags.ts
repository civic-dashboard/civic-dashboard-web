import fs from 'fs';
import path from 'path';
import { toSlug } from '@/logic/toSlug';

async function main() {
  const csvPath = path.join(process.cwd(), 'seeds', 'all_terms.csv');
  const outputPath = path.join(
    process.cwd(),
    'seeds',
    'category_tags_generated.json',
  );

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
  const seenRaw = new Set<string>();

  // Skip header and empty lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, but handle potential quoted values if necessary.
    const columns = line.split(',');

    let rawTerm = columns[subjectTermIdx];
    if (!rawTerm) continue;

    // Replace parentheses with space so they are kept as part of the term
    // Then split on semicolons, brackets, and commas to match explodeSubjectTerms logic
    const explodedTerms = rawTerm
      .replace(/[()]/g, ' ')
      .split(/[{[\]};,]+/g)
      .map((t) => t.trim())
      .filter(Boolean);

    for (let term of explodedTerms) {
      // Replace dashes with spaces and normalize whitespace
      term = term.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
      const normalizedTerm = term.toLowerCase();

      if (seenRaw.has(normalizedTerm)) continue;
      seenRaw.add(normalizedTerm);

      const category = columns[maxCatIdx];

      result.push({
        tagRaw: term,
        category: category,
        tagNormalized: term,
        tagSlug: toSlug(term),
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
