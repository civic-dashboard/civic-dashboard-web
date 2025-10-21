// File: src/app/info/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Info – Civic Dashboard',
};

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

interface HtmlDocument {
  filename: string;
  title: string;
  content: string;
}

async function getAllHtmlContent(): Promise<HtmlDocument[]> {
  try {
    // Fetch manifest.json
    const manifestResponse = await fetch('/html/manifest.json');
    
    if (!manifestResponse.ok) {
      console.error('Manifest not found:', manifestResponse.statusText);
      return [];
    }

    const filenames: string[] = await manifestResponse.json();
    console.log('Loaded manifest with files:', filenames);

    const documents: HtmlDocument[] = [];

    for (const filename of filenames) {
      try {
        // Fetch individual HTML file
        const htmlResponse = await fetch(`/html/${filename}`);
        
        if (!htmlResponse.ok) {
          console.warn(`File not found: ${filename}`);
          continue;
        }

        const htmlContent = await htmlResponse.text();

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