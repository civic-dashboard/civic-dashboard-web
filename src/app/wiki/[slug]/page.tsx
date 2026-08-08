import type { Metadata } from 'next';
import WikiDocClient from '@/app/wiki/wikiDocClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // params.slug is the full filename, e.g., "Deputations.html"
  const { slug } = await params;
  return {
    title: `${slug.replace(/\.html$/i, '')} – Civic Dashboard`,
  };
}

export default async function WikiDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <WikiDocClient filename={slug} />
        </div>
      </main>
    </div>
  );
}
