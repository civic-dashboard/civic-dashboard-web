// app/info/page.tsx
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Info – Civic Dashboard',
};

// Optional: force dynamic so Cloudflare/Next won’t cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HtmlDocument {
  filename: string;
  title: string;
  content: string;
}

function buildOrigin() {
  const h = headers();
  // Cloudflare / proxies typically set these:
  const proto = h.get('x-forwarded-proto') || 'https';
  const host =
    h.get('x-forwarded-host') ||
    h.get('host') ||
    process.env.NEXT_PUBLIC_SITE_HOST ||
    'localhost:3000';

  return `${proto}://${host}`;
}

async function getAllHtmlContent(): Promise<HtmlDocument[]> {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL /* explicit override if you want */ ||
      buildOrigin();

    // Fetch manifest (absolute URL required on edge)
    const manifestUrl = `${origin}/html/manifest.json`;
    const manifestResponse = await fetch(manifestUrl, {
      // Avoid CDN & Next caching while you iterate; relax later if needed
      cache: 'no-store',
      headers: {
        // Helps some CDNs treat this as non-cacheable during dev
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });

    if (!manifestResponse.ok) {
      console.error(
        'Failed to fetch manifest:',
        manifestResponse.status,
        manifestUrl,
      );
      return [];
    }

    const filenames: string[] = await manifestResponse.json();
    const documents: HtmlDocument[] = [];

    for (const filename of filenames) {
      const fileUrl = `${origin}/html/${filename}`;
      try {
        const response = await fetch(fileUrl, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        });

        if (!response.ok) {
          console.warn(
            `Failed to fetch ${filename}: ${response.status}`,
            fileUrl,
          );
          continue;
        }

        const htmlContent = await response.text();

        // Extract <title>...</title>
        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch
          ? titleMatch[1]
          : filename.replace('.html', '');

        // Extract <body>...</body>
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const content = bodyMatch ? bodyMatch[1] : htmlContent;

        documents.push({ filename, title, content });
      } catch (error) {
        console.error(`Error fetching HTML file ${filename}:`, error);
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
