/* eslint-disable no-useless-escape */
import fs from 'fs';
import path from 'path';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

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

    // Remove brackets, parentheses (and content), and replace dashes with spaces
    rawTerm = rawTerm
      .replace(/[\[\]]/g, '') // Remove brackets
      .replace(/\([^)]*\)/g, '') // Remove anything in parentheses
      .replace(/-/g, ' ') // Replace dashes with spaces
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .trim();

    const normalizedRaw = rawTerm.toLowerCase();

    if (seenRaw.has(normalizedRaw)) continue;
    seenRaw.add(normalizedRaw);

    const category = columns[maxCatIdx];

    result.push({
      tagRaw: rawTerm,
      category: category,
      tagNormalized: rawTerm,
      tagSlug: slugify(rawTerm),
    });
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
