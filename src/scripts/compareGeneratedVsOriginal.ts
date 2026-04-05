/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

async function main() {
  const originalPath = path.join(
    process.cwd(),
    'seeds',
    'categories_tags.json',
  );
  const generatedPath = path.join(
    process.cwd(),
    'seeds',
    'category_tags_generated.json',
  );
  const outputPath = path.join(
    process.cwd(),
    'seeds',
    'generated_tags_missing_from_original.txt',
  );

  if (!fs.existsSync(originalPath) || !fs.existsSync(generatedPath)) {
    console.error('Error: Original or Generated JSON file not found.');
    process.exit(1);
  }

  const original = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
  const generated = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));

  const originalSet = new Set(original.map((t: any) => t.tagRaw.toLowerCase()));

  const missing = generated
    .map((t: any) => t.tagRaw)
    .filter((raw: string) => !originalSet.has(raw.toLowerCase()));

  // Remove duplicates and sort
  const uniqueMissing = Array.from(new Set(missing)).sort();

  fs.writeFileSync(outputPath, uniqueMissing.join('\n'));
  console.log(`Successfully generated ${outputPath}`);
  console.log(
    `Found ${uniqueMissing.length} tags in the generated file that are missing from the original.`,
  );
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
