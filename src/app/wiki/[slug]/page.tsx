import type { Metadata } from 'next';
import WikiDocClient from '@/app/wiki/wikiDocClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  // params.slug is the full filename, e.g., "Deputations.html"
  return {
    title: `${params.slug.replace(/\.html$/i, '')} – Civic Dashboard`,
  };
}

export default async function WikiDocPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* pass the exact filename (with .html) */}
          <WikiDocClient filename={params.slug} />
        </div>
      </main>
    </div>
  );
}
