import DOMPurify, {
  type Config as DOMPurifyConfig,
} from 'isomorphic-dompurify';

const config: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'ul',
    'ol',
    'li',
    'em',
    'sup',
    // 'a', // Todo: tricky since we ought to add rel, target, and class
  ],
  ALLOWED_ATTR: ['title'],
};

export const sanitize = (text: string) => {
  if (!text) return '';
  return DOMPurify.sanitize(text, config);
};

export const stripHtmlAndGetFirstParagraph = (html: string) => {
  if (!html) return '';

  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&rsquo;': "'",
    '&#39;': "'",
    '&apos;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&quot;': '"',
    '&lsquo;': "'",
    '&hellip;': '...',
    '&ndash;': '-',
    '&mdash;': '—',
    '&middot;': '·',
    '&bull;': '•',
    '&#8209;': '-',
    '&#8239;': ' ',
    '&trade;': '™',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
  };

  // 1. Replace block elements and line breaks with a newline to identify boundaries.
  // 2. Strip all remaining HTML tags.
  // 3. Decode common HTML entities.
  const text = html
    .replace(/<\/?(p|br|div|li|tr|td|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z0-9#]+;/gi, (m) => entities[m.toLowerCase()] || m);

  // 4. Split by newline and take the first non-empty line.
  return (
    text
      .split('\n')
      .map((line) => line.trim().replace(/\s+/g, ' '))
      .find((line) => line.length > 0) || ''
  );
};

export const validateUrl = async (url: string | null | undefined) => {
  if (!url) return false;
  try {
    // Check if the URL is valid
    new URL(url);

    // Check if the api given URL can be reached
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
