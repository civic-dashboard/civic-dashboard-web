import type { Metadata } from 'next';
import WikiDocClient from '@/app/wiki/wikiDocClient';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readPublishedHtmlHead(slug: string): Promise<string | null> {
  const slicesize = 1024;

  // Production: Cloudflare Assets Binding
  try {
    const cf = await getCloudflareContext({ async: true });
    const res = await cf.env.ASSETS!.fetch(new URL(`https://assets/html/${slug}`));
    if (res.ok) return (await res.text()).slice(0, slicesize);
  } catch {}
  console.log(`Not running on Workers`);

  // Development: Local File System
  try {
    const filePath = path.join(process.cwd(), 'public', 'html', slug);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').slice(0, slicesize);
    }
  } catch {}
  console.log(`No local file found`);

  return null;
}

async function getTitleFromHtmlFile(slug: string): Promise<string | null> {
  const headSnippet = await readPublishedHtmlHead(slug)

  if (headSnippet != null){
    const titleMatch = headSnippet.match(/<title>([\s\S]*?)<\/title>/i);
      if (titleMatch && titleMatch[1].trim()) {
        return titleMatch[1].trim();
      } else {
        console.log(`no title found in ${slug}:`);
      }
  } else {
    console.log(`no head snippet found for ${slug}:`);
  }

  // Fallback to filename if file or tag is missing
  return slug.replace(/\.html$/i, '');
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageTitle = await getTitleFromHtmlFile(params.slug);

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
