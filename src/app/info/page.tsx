// File: src/app/docs/page.tsx
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export const metadata: Metadata = {
  title: 'Documentation – Civic Dashboard',
};

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

interface MarkdownDocument {
  slug: string;
  title: string;
  html: string;
  order?: number;
}

function getAllMarkdownContent(): MarkdownDocument[] {
  try {
    const markdownDir = path.join(process.cwd(), 'contents', 'markdown');
    const files = fs.readdirSync(markdownDir);

    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const slug = file.replace('.md', '');
        const filePath = path.join(markdownDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        let title = slug;
        let markdownContent = fileContent;
        let order = 999; // Default order if not specified

        // Parse front matter
        const frontMatterMatch = fileContent.match(
          /^---\s*\n(.*?)\n---\s*\n(.*)$/s,
        );

        if (frontMatterMatch) {
          const frontMatter = frontMatterMatch[1];
          markdownContent = frontMatterMatch[2];

          // Extract title
          const titleMatch = frontMatter.match(/title:\s*['"]?([^'"]+)['"]?/);
          if (titleMatch) {
            title = titleMatch[1];
          }

          // Extract order for sorting
          const orderMatch = frontMatter.match(/order:\s*(\d+)/);
          if (orderMatch) {
            order = parseInt(orderMatch[1]);
          }
        } else {
          // Try to extract title from first H1
          const h1Match = markdownContent.match(/^#\s+(.+)$/m);
          if (h1Match) {
            title = h1Match[1];
          }
        }

        const html = marked(markdownContent);

        return { slug, title, html, order };
      })
      .sort((a, b) => a.order - b.order); // Sort by order field
  } catch (error) {
    console.error('Error reading markdown files:', error);
    return [];
  }
}

export default function DocsPage() {
  const documents = getAllMarkdownContent();

  if (documents.length === 0) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-red-600">
              No markdown files found in contents/markdown/
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-16">
          {documents.map((doc, index) => (
            <section
              key={doc.slug}
              id={doc.slug}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: doc.html }} />

              {/* Separator between documents (except last one) */}
              {index < documents.length - 1 && (
                <hr className="my-16 border-t-2 border-gray-200" />
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
