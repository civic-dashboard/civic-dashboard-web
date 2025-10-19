import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Info – Civic Dashboard',
};

async function getHtmlContent(filename: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'html', filename);
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    // Extract just the body content (remove the template wrapper)
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);

    if (bodyMatch) {
      return bodyMatch[1];
    }

    // If no body tag found, return the full content
    return htmlContent;
  } catch (error) {
    console.error(`Error reading HTML file: ${filename}`, error);
    return null;
  }
}

export default async function Info() {
  const infoContent = await getHtmlContent('info.html');

  if (!infoContent) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12">
          <p className="text-red-600">Unable to load content</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: infoContent }} />
        </div>
      </main>
    </div>
  );
}
