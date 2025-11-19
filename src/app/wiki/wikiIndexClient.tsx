'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Doc = { filename: string; title: string };

export default function WikiIndexClient() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/html/manifest.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`manifest ${res.status}`);
        const filenames: string[] = await res.json();

        const list: Doc[] = [];
        for (const filename of filenames) {
          try {
            const htmlRes = await fetch(`/html/${filename}`, {
              cache: 'no-store',
            });
            if (!htmlRes.ok) continue;
            const html = await htmlRes.text();
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch
              ? titleMatch[1]
              : filename.replace(/\.html$/i, '');
            list.push({ filename, title });
          } catch {
            /* ignore per-file errors */
          }
        }

        list.sort((a, b) => a.title.localeCompare(b.title));
        setDocs(list);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load list');
        setDocs([]);
      }
    })();
  }, []);

  if (docs === null)
    return <p className="text-center text-gray-600">Loading…</p>;

  if (docs.length === 0) {
    return (
      <div className="text-center">
        <p className="text-red-600">
          {error ? `Error: ${error}` : 'No HTML files found in public/html/'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Civic Dashboard Wiki
      </h1>
      <ul className="space-y-3 text-lg text-center">
        {docs.map((doc) => (
          <li key={doc.filename}>
            <Link
              href={`/wiki/${encodeURIComponent(doc.filename)}`}
              className="text-blue-600 hover:underline"
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
