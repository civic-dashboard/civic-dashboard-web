'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3
}

function extractTableOfContents(htmlContent: string): TocItem[] {
  const toc: TocItem[] = [];

  // Match h2 and h3 tags
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    const rawText = match[2].replace(/<[^>]*>/g, ''); // Strip HTML tags

    // Decode HTML entities (e.g., &#39; → ', &amp; → &)
    const text = rawText
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&'); // Do &amp; last to avoid double-decoding

    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}

function addIdsToHeadings(htmlContent: string): string {
  return htmlContent.replace(
    /<h([23])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Only add id if it doesn't already exist
      if (!attrs.includes('id=')) {
        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
      }
      return match;
    },
  );
}

function extractTitle(htmlContent: string): {
  title: string | null;
  contentWithoutTitle: string;
} {
  // Extract first h1 tag
  const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!h1Match) {
    return { title: null, contentWithoutTitle: htmlContent };
  }

  const rawTitle = h1Match[1].replace(/<[^>]*>/g, ''); // Strip any nested tags
  // Decode entities
  const title = rawTitle
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // Remove the h1 from content
  const contentWithoutTitle = htmlContent.replace(/<h1[^>]*>.*?<\/h1>/i, '');

  return { title, contentWithoutTitle };
}

export default function WikiDocClient({ filename }: { filename: string }) {
  const [title, setTitle] = useState<string | null>(null);
  const [bodyHtml, setBodyHtml] = useState<string | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTitle(null);
      setBodyHtml(null);
      setToc([]);
      try {
        const url = `/html/${encodeURIComponent(filename)}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`File not found (${res.status})`);
        const html = await res.text();

        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        let content = bodyMatch ? bodyMatch[1] : html;

        // Extract title (first h1) and remove it from content
        const { title: extractedTitle, contentWithoutTitle } =
          extractTitle(content);
        setTitle(extractedTitle);
        content = contentWithoutTitle;

        // Extract table of contents
        const tocItems = extractTableOfContents(content);
        setToc(tocItems);

        // Add IDs to headings for navigation
        content = addIdsToHeadings(content);

        setBodyHtml(content);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    })();
  }, [filename]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <p className="text-center text-gray-600">Loading…</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  const hasToc = toc.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      {title && (
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      )}

      {/* Table of Contents */}
      {hasToc && (
        <nav className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={item.id} className={item.level === 3 ? 'ml-6' : ''}>
                <a
                  href={`#${item.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-start"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="mr-2">{item.level === 2 ? '•' : '◦'}</span>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Main Content */}
      <article
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: bodyHtml ?? '' }}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
