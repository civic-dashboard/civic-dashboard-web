import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Info – Civic Dashboard',
};

interface HtmlDocument {
  filename: string;
  title: string;
  content: string;
}

async function getAllHtmlContent(): Promise<HtmlDocument[]> {
  try {
    // In development/build, read from filesystem
    // In production (Cloudflare), this won't work, so we'll use fetch

    // Try filesystem first (works in dev and build)
    if (typeof window === 'undefined') {
      // Server-side: use filesystem
      const manifestPath = path.join(
        process.cwd(),
        'public',
        'html',
        'manifest.json',
      );

      if (!fs.existsSync(manifestPath)) {
        console.error('Manifest not found at:', manifestPath);
        return [];
      }

      const manifestContent = fs.readFileSync(manifestPath, 'utf8');
      const filenames: string[] = JSON.parse(manifestContent);
      console.log('Loaded manifest with files:', filenames);

      const documents: HtmlDocument[] = [];

      for (const filename of filenames) {
        try {
          const htmlPath = path.join(process.cwd(), 'public', 'html', filename);

          if (!fs.existsSync(htmlPath)) {
            console.warn(`File not found: ${htmlPath}`);
            continue;
          }

          const htmlContent = fs.readFileSync(htmlPath, 'utf8');

          // Extract title from HTML
          const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
          const title = titleMatch
            ? titleMatch[1]
            : filename.replace('.html', '');

          // Extract body content
          const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          const content = bodyMatch ? bodyMatch[1] : htmlContent;

          documents.push({
            filename,
            title,
            content,
          });
        } catch (error) {
          console.error(`Error reading HTML file ${filename}:`, error);
        }
      }

      return documents.sort((a, b) => a.filename.localeCompare(b.filename));
    }

    return [];
  } catch (error) {
    console.error('Error loading HTML files:', error);
    return [];
  }
}

export default async function Info() {
  const documents = await getAllHtmlContent();

  if (documents.length === 0) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-red-600">No HTML files found in public/html/</p>
            <p className="text-gray-600 mt-2">
              Run{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                npm run build:html
              </code>{' '}
              to generate HTML files from markdown.
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
              key={doc.filename}
              id={doc.filename.replace('.html', '')}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: doc.content }} />

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
