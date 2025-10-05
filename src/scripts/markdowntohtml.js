#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Configuration
const CONFIG = {
  inputDir: './content/markdown',
  outputDir: './public/html',
  templatePath: './src/scripts/template.html',
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

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
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
  
  const frontMatterMatch = content.match(/^---\s*\n(.*?)\n---\s*\n(.*)$/s);
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
    .map(file => `<li><a href="${file.fileName}.html">${file.title}</a></li>`)
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
  
  // Check if input directory exists
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error(`❌ Input directory not found: ${CONFIG.inputDir}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  ensureDirectoryExists(CONFIG.outputDir);
  
  // Load template
  const template = loadTemplate();
  
  // Find all markdown files
  const markdownFiles = fs.readdirSync(CONFIG.inputDir)
    .filter(file => path.extname(file).toLowerCase() === '.md')
    .map(file => path.join(CONFIG.inputDir, file));
  
  if (markdownFiles.length === 0) {
    console.log(`⚠️  No markdown files found in ${CONFIG.inputDir}`);
    return;
  }
  
  console.log(`📁 Found ${markdownFiles.length} markdown file(s)`);
  
  // Process each file
  const processedFiles = markdownFiles.map(filePath => 
    processMarkdownFile(filePath, template)
  );
  
  // Generate index page
  generateIndex(processedFiles);
  
  console.log(`✨ Completed! Generated ${processedFiles.length} HTML files in ${CONFIG.outputDir}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { processMarkdownFile, CONFIG };
