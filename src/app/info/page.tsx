import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export const metadata: Metadata = {
  title: 'Info – Civic Dashboard',
};

marked.setOptions({
  gfm: true,
  breaks: false,
});

async function getMarkdownContent(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'contents', 'markdown', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const frontMatterMatch = fileContent.match(
      /^---\s*\n(.*?)\n---\s*\n(.*)$/s,
    );

    if (frontMatterMatch) {
      const markdownContent = frontMatterMatch[2];
      return marked(markdownContent);
    }

    return marked(fileContent);
  } catch (error) {
    console.error(`Error reading markdown file: ${filename}`, error);
    return null;
  }
}

export default async function Info() {
  const infoContent = await getMarkdownContent('info.md');

  if (!infoContent) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12">
          <p className="text-red-600">Unable to load content</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: infoContent }} />
        </div>
      </main>
    </div>
  );
}
