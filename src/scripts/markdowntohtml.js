#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Configuration
const CONFIG = {
  inputDir: './contents/markdown',
  outputDir: './public/html',
  templatePath: './src/scripts/template.html',
  mediaInputDir: './contents/media',
  mediaOutputDir: './public/html/media',
};

// HTML template (used if no template file exists)
const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem;
            line-height: 1.6;
        }
        h1, h2, h3 { color: #333; }
        pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        code { background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; }
        img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        video { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
        a[href$=".pdf"]::after { content: " 📄"; }
        a[href$=".mp4"]::after, a[href$=".webm"]::after { content: " 🎥"; }
    </style>
</head>
<body>
    {{content}}
</body>
</html>`;

// Configure marked
marked.setOptions({
  breaks: false,
  gfm: true,
  headerIds: true,
  mangle: false,
  sanitize: false,
});

// Custom image renderer: add loading="lazy" for local media/ paths
marked.use({
  renderer: {
    image(href, title, text) {
      if (href.startsWith('media/')) {
        const escapedText = text ? text.replace(/"/g, '&quot;') : '';
        const titleAttr = title
          ? ` title="${title.replace(/"/g, '&quot;')}"`
          : '';
        return `<img src="/html/${href}" alt="${escapedText}"${titleAttr} loading="lazy">`;
      }
      return false; // use default renderer for external URLs
    },
  },
});

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function copyMediaFiles() {
  if (!fs.existsSync(CONFIG.mediaInputDir)) {
    console.log('⚠️  No media directory found, skipping media copy');
    return;
  }

  ensureDirectoryExists(CONFIG.mediaOutputDir);

  function copyDirectory(src, dest) {
    ensureDirectoryExists(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📎 Copied media: ${entry.name}`);
      }
    }
  }

  copyDirectory(CONFIG.mediaInputDir, CONFIG.mediaOutputDir);
  console.log('✅ Media files copied successfully');
}

function extractTitle(content) {
  // Try to extract title from first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1];
  }

  // Fallback to filename-based title
  return 'Generated HTML';
}

function loadTemplate() {
  if (fs.existsSync(CONFIG.templatePath)) {
    return fs.readFileSync(CONFIG.templatePath, 'utf8');
  }
  return DEFAULT_TEMPLATE;
}

function processMarkdownFile(filePath, template) {
  const fileName = path.basename(filePath, '.md');
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract metadata if present (simple front matter)
  let title = fileName;
  let markdownContent = content;

  const frontMatterMatch = content.match(
    /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/,
  );
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1];
    markdownContent = frontMatterMatch[2];

    // Extract title from front matter
    const titleMatch = frontMatter.match(/title:\s*['"]?([^'"]+)['"]?/);
    if (titleMatch) {
      title = titleMatch[1];
    }
  } else {
    // Try to extract title from content
    title = extractTitle(content) || fileName;
  }

  // Convert markdown to HTML
  const htmlContent = marked(markdownContent);

  // Apply template
  const finalHtml = template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{content\}\}/g, htmlContent)
    .replace(/\{\{filename\}\}/g, fileName);

  // Write output file
  const outputPath = path.join(CONFIG.outputDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, finalHtml);

  console.log(`✅ Generated: ${fileName}.md → ${fileName}.html`);
  return { fileName, title, outputPath };
}

function generateIndex(processedFiles) {
  const indexContent = processedFiles
    .map((file) => `<li><a href="${file.fileName}.html">${file.title}</a></li>`)
    .join('\n');

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Pages</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px; 
            margin: 2rem auto; 
            padding: 2rem;
        }
        ul { list-style-type: none; padding: 0; }
        li { margin: 0.5rem 0; }
        a { text-decoration: none; color: #0066cc; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Generated Pages</h1>
    <ul>
        ${indexContent}
    </ul>
</body>
</html>`;

  const indexPath = path.join(CONFIG.outputDir, 'index.html');
  fs.writeFileSync(indexPath, indexHtml);
  console.log(`📋 Generated index: index.html`);
}

function main() {
  console.log('🚀 Starting markdown to HTML conversion...');
  console.log('📂 Looking in:', CONFIG.inputDir);
  console.log('📂 Current directory:', process.cwd());

  // Check if input directory exists
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error(`❌ Input directory not found: ${CONFIG.inputDir}`);
    console.error(
      `📂 Absolute path would be: ${path.resolve(CONFIG.inputDir)}`,
    );
    process.exit(1);
  }

  console.log('✅ Input directory exists!');

  // Ensure output directory exists
  ensureDirectoryExists(CONFIG.outputDir);

  // Copy media files (images, videos, documents) to output
  copyMediaFiles();

  // Load template
  const template = loadTemplate();
  console.log('✅ Template loaded');

  // Find all markdown files
  const allFiles = fs.readdirSync(CONFIG.inputDir);
  console.log('📄 All files in directory:', allFiles);

  const markdownFiles = allFiles
    .filter((file) => path.extname(file).toLowerCase() === '.md')
    .map((file) => path.join(CONFIG.inputDir, file));

  console.log('📝 Markdown files found:', markdownFiles);

  if (markdownFiles.length === 0) {
    console.log(`⚠️  No markdown files found in ${CONFIG.inputDir}`);
    return;
  }

  console.log(`📁 Found ${markdownFiles.length} markdown file(s)`);

  // Process each file
  const processedFiles = markdownFiles.map((filePath) =>
    processMarkdownFile(filePath, template),
  );

  // Generate index page
  generateIndex(processedFiles);

  // Generate manifest file for dynamic loading
  const manifest = processedFiles.map((file) => `${file.fileName}.html`);
  const manifestPath = path.join(CONFIG.outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(
    `📋 Generated manifest: manifest.json (${manifest.length} files)`,
  );

  console.log(
    `✨ Completed! Generated ${processedFiles.length} HTML files in ${CONFIG.outputDir}`,
  );
}

// Check if this file is being run directly
const isRunningDirectly =
  process.argv[1] &&
  (import.meta.url === `file://${process.argv[1]}` ||
    import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`);

console.log('Debug - import.meta.url:', import.meta.url);
console.log('Debug - process.argv[1]:', process.argv[1]);
console.log('Debug - isRunningDirectly:', isRunningDirectly);

if (isRunningDirectly) {
  main();
} else {
  console.log(
    '⚠️  Script is being imported, not run directly. Call main() to execute.',
  );
}

export { processMarkdownFile, CONFIG };
