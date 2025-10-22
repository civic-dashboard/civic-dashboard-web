'use client';

import { useEffect, useState } from 'react';

export default function WikiDocClient({ slug }: { slug: string }) {
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setBodyHtml(null);
      try {
        const res = await fetch(`/html/${slug}.html`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`File not found (${res.status})`);
        const html = await res.text();
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        setBodyHtml(bodyMatch ? bodyMatch[1] : html);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load page');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <p className="text-center text-gray-600">Loading…</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <article
      className="prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: bodyHtml ?? '' }}
    />
  );
}
