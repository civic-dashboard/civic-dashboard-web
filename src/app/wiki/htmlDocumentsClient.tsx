'use client';

import { useEffect, useState } from 'react';

interface HtmlDocument {
  filename: string;
  title: string;
}

export default function HtmlDocumentsClient() {
  const [docs, setDocs] = useState<HtmlDocument[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Fetch manifest dynamically relative to the current deployment
        const manifestRes = await fetch('/html/manifest.json', {
          cache: 'no-store',
        });
        if (!manifestRes.ok) {
          setError(`Failed to fetch manifest: ${manifestRes.status}`);
          setDocs([]);
          return;
        }

        const filenames: string[] = await manifestRes.json();
        const documents: HtmlDocument[] = [];

        for (const filename of filenames) {
          // Try to extract a human-friendly title from each file
          try {
            const res = await fetch(`/html/${filename}`, { cache: 'no-store' });
            if (!res.ok) continue;
            const html = await res.text();

            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch
              ? titleMatch[1]
              : filename.replace('.html', '');

            documents.push({ filename, title });
          } catch {
            // ignore individual fetch errors
          }
        }

        documents.sort((a, b) => a.filename.localeCompare(b.filename));
        setDocs(documents);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
        setDocs([]);
      }
    })();
  }, []);

  if (docs === null) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <p className="text-red-600">No HTML files found in public/html/</p>
            <p className="text-gray-600 mt-2">
              Run{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                npm run build:html
              </code>{' '}
              to generate HTML files from markdown.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Civic Dashboard Wiki Resources
      </h1>
      <ul className="space-y-3 text-lg">
        {docs.map((doc) => (
          <li key={doc.filename}>
            <a
              href={`/html/${doc.filename}`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
