'use client';

import { useEffect, useState } from 'react';

interface HtmlDocument {
  filename: string;
  title: string;
}

export default function HtmlDocumentsClient() {
  const [docs, setDocs] = useState<HtmlDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<HtmlDocument | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the manifest on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/html/manifest.json', { cache: 'no-store' });
        if (!res.ok)
          throw new Error(`Failed to fetch manifest (${res.status})`);
        const filenames: string[] = await res.json();

        const titles: HtmlDocument[] = [];
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
              : filename.replace('.html', '');
            titles.push({ filename, title });
          } catch {
            // ignore individual file failures
          }
        }
        titles.sort((a, b) => a.title.localeCompare(b.title));
        setDocs(titles);
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
      }
    })();
  }, []);

  const handleClick = async (doc: HtmlDocument) => {
    setSelectedDoc(doc);
    setLoading(true);
    setHtmlContent(null);
    setError(null);

    try {
      const res = await fetch(`/html/${doc.filename}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch ${doc.filename}`);
      const html = await res.text();
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      setHtmlContent(bodyMatch ? bodyMatch[1] : html);
    } catch (e: any) {
      setError(e?.message ?? 'Error loading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Civic Dashboard Wiki
      </h1>

      {/* Links list */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {docs.length === 0 && !error && <p className="text-gray-600">Loading…</p>}

      <ul className="space-y-3 text-lg mb-8 text-center">
        {docs.map((doc) => (
          <li key={doc.filename}>
            <button
              onClick={() => handleClick(doc)}
              className={`text-blue-600 hover:underline ${
                selectedDoc?.filename === doc.filename ? 'font-semibold' : ''
              }`}
            >
              {doc.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Render HTML after click */}
      {selectedDoc && (
        <div className="border-t border-gray-300 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {selectedDoc.title}
          </h2>

          {loading && (
            <p className="text-gray-600 text-center">Loading content…</p>
          )}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {htmlContent && (
            <article
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </div>
      )}
    </div>
  );
}
