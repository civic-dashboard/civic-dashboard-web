// app/wiki/[slug]/page.tsx
import { headers } from 'next/headers';
import type { Metadata } from 'next';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { slug: string };

function buildOrigin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!host) throw new Error('Missing host header');
  return `${proto}://${host}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  // Set a provisional title; we’ll render the real one in the page body too.
  return { title: `Page – ${params.slug}` };
}

export default async function WikiDoc({ params }: { params: Params }) {
  const origin = buildOrigin();
  const filename = `${params.slug}.html`;

  const res = await fetch(`${origin}/html/${filename}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-store' },
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Not found</h1>
            <p className="text-gray-600">
              Couldn’t load{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded">
                {filename}
              </code>
              .
            </p>
          </div>
        </main>
      </div>
    );
  }

  const html = await res.text();
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : params.slug;

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6 text-center">{title}</h1>
          <article
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </main>
    </div>
  );
}
