import type { Metadata } from 'next';
import WikiDocClient from '@/app/wiki/wikiDocClient';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getTitleFromHtmlFile(slug: string): string {

  try {
    const filePath = path.join(process.cwd(), 'public', 'html', slug);

    if (fs.existsSync(filePath)) {
      const bufsize = 1024;

      const buffer = Buffer.alloc(bufsize);
      const fd = fs.openSync(filePath, 'r');
      const bytesRead = fs.readSync(fd, buffer, 0, bufsize, 0);
      fs.closeSync(fd);

      const headSnippet = buffer.toString('utf8', 0, bytesRead);

      const titleMatch = headSnippet.match(/<title>([\s\S]*?)<\/title>/i);
      if (titleMatch && titleMatch[1].trim()) {
        return titleMatch[1].trim();
      }
    }
  } catch (error) {
    console.error(`Error reading title from ${slug}:`, error);
  }

  // Fallback to filename if file or tag is missing
  return slug.replace(/\.html$/i, '');
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageTitle = getTitleFromHtmlFile(params.slug);

  return {
    title: `${pageTitle} – Civic Dashboard`,
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
