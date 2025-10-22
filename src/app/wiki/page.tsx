// app/wiki/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Generated Pages – Civic Dashboard',
};
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function buildOrigin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!host) throw new Error('Missing host header');
  return `${proto}://${host}`;
}

async function getDocs() {
  const origin = buildOrigin();

  const res = await fetch(`${origin}/html/manifest.json`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-store' },
  });
  if (!res.ok) return [];

  const filenames = (await res.json()) as string[];

  const docs: { slug: string; title: string }[] = [];
  for (const filename of filenames) {
    const slug = filename.replace(/\.html$/i, '');
    try {
      const f = await fetch(`${origin}/html/${filename}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-store' },
      });
      if (!f.ok) continue;
      const html = await f.text();
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : slug;
      docs.push({ slug, title });
    } catch {
      // ignore per-file errors
    }
  }

  docs.sort((a, b) => a.title.localeCompare(b.title));
  return docs;
}

export default async function WikiIndex() {
  const docs = await getDocs();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            Generated Pages
          </h1>

          {docs.length === 0 ? (
            <div className="text-center">
              <p className="text-red-600">
                No HTML files found in public/html/
              </p>
              <p className="text-gray-600 mt-2">
                Run{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  npm run build:html
                </code>{' '}
                to generate them.
              </p>
            </div>
          ) : (
            <ul className="space-y-3 text-lg text-center">
              {docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/wiki/${doc.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
