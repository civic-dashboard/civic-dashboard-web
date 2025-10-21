/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';

interface HtmlDocument {
  filename: string;
  title: string;
  content: string;
}

export default function HtmlDocumentsClient() {
  const [docs, setDocs] = useState<HtmlDocument[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Relative path => always correct for the current deploy hostname
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
          try {
            const res = await fetch(`/html/${filename}`, { cache: 'no-store' });
            if (!res.ok) continue;

            const html = await res.text();

            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch
              ? titleMatch[1]
              : filename.replace('.html', '');

            const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
            const content = bodyMatch ? bodyMatch[1] : html;

            documents.push({ filename, title, content });
          } catch (e) {
            // ignore individual file failures
          }
        }

        documents.sort((a, b) => a.filename.localeCompare(b.filename));
        setDocs(documents);
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
        setDocs([]);
      }
    })();
  }, []);

  if (docs === null) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
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
    <div className="max-w-3xl mx-auto space-y-16">
      {docs.map((doc, index) => (
        <section
          key={doc.filename}
          id={doc.filename.replace('.html', '')}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div dangerouslySetInnerHTML={{ __html: doc.content }} />
          {index < docs.length - 1 && (
            <hr className="my-16 border-t-2 border-gray-200" />
          )}
        </section>
      ))}
    </div>
  );
}
