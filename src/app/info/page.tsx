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

function getAllHtmlContent(): HtmlDocument[] {
  try {
    const htmlDir = path.join(process.cwd(), 'public', 'html');

    // Check if directory exists
    if (!fs.existsSync(htmlDir)) {
      console.error('HTML directory not found:', htmlDir);
      return [];
    }

    const files = fs.readdirSync(htmlDir);

    return files
      .filter((file) => file.endsWith('.html') && file !== 'index.html') // Skip index.html
      .map((file) => {
        const filePath = path.join(htmlDir, file);
        const htmlContent = fs.readFileSync(filePath, 'utf8');

        // Extract title from HTML
        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : file.replace('.html', '');

        // Extract body content
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const content = bodyMatch ? bodyMatch[1] : htmlContent;

        return {
          filename: file,
          title,
          content,
        };
      })
      .sort((a, b) => a.filename.localeCompare(b.filename));
  } catch (error) {
    console.error('Error reading HTML files:', error);
    return [];
  }
}

export default function Info() {
  const documents = getAllHtmlContent();

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
