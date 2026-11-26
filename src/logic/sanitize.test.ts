import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  sanitize,
  stripHtmlAndGetFirstParagraph,
  validateUrl,
} from '@/logic/sanitize';

describe('sanitize', () => {
  it('returns an empty string for empty input', () => {
    expect(sanitize('')).toBe('');
  });

  it('keeps allowed formatting tags', () => {
    const html = '<p><strong>Bold</strong> and <em>italic</em></p>';
    expect(sanitize(html)).toBe(html);
  });

  it('keeps tables', () => {
    const html = '<table><tbody><tr><td>Cell</td></tr></tbody></table>';
    expect(sanitize(html)).toBe(html);
  });

  it('removes script tags and their contents', () => {
    expect(sanitize('<p>Hi</p><script>alert(1)</script>')).toBe('<p>Hi</p>');
  });

  it('removes event handler attributes', () => {
    expect(sanitize('<p onclick="alert(1)">Hi</p>')).toBe('<p>Hi</p>');
  });

  it('removes img tags entirely, since img is not an allowed tag', () => {
    expect(sanitize('<img src="x" onerror="alert(1)">')).toBe('');
  });

  it('removes iframes', () => {
    expect(sanitize('<iframe src="https://example.com"></iframe>')).toBe('');
  });

  it('removes a tags but keeps their text, since a is not an allowed tag', () => {
    expect(sanitize('<a href="javascript:alert(1)">Click</a>')).toBe('Click');
  });

  it('keeps the title attribute', () => {
    expect(sanitize('<p title="Note">Hi</p>')).toBe('<p title="Note">Hi</p>');
  });

  it('removes color styles but keeps other styles', () => {
    expect(sanitize('<p style="color: red; font-weight: bold">Hi</p>')).toBe(
      '<p style="font-weight:bold">Hi</p>',
    );
  });

  it('matches the color property regardless of case', () => {
    expect(sanitize('<p style="COLOR: red">Hi</p>')).toBe('<p>Hi</p>');
  });

  it('removes the style attribute when only color was set', () => {
    expect(sanitize('<p style="color:red">Hi</p>')).toBe('<p>Hi</p>');
  });
});

describe('stripHtmlAndGetFirstParagraph', () => {
  it('returns an empty string for empty input', () => {
    expect(stripHtmlAndGetFirstParagraph('')).toBe('');
  });

  it('returns only the first paragraph', () => {
    expect(stripHtmlAndGetFirstParagraph('<p>First</p><p>Second</p>')).toBe(
      'First',
    );
  });

  it('skips empty leading paragraphs', () => {
    expect(stripHtmlAndGetFirstParagraph('<p> </p><p>Real text</p>')).toBe(
      'Real text',
    );
  });

  it('treats line breaks as paragraph boundaries', () => {
    expect(stripHtmlAndGetFirstParagraph('Line one<br>Line two')).toBe(
      'Line one',
    );
  });

  it('strips inline tags', () => {
    expect(
      stripHtmlAndGetFirstParagraph('<p>A <strong>bold</strong> move</p>'),
    ).toBe('A bold move');
  });

  it('decodes common HTML entities', () => {
    expect(
      stripHtmlAndGetFirstParagraph(
        '<p>Tom&rsquo;s &amp; Jerry&nbsp;&hellip;</p>',
      ),
    ).toBe("Tom's & Jerry ...");
  });

  it('decodes entities regardless of case', () => {
    expect(stripHtmlAndGetFirstParagraph('A &AMP; B')).toBe('A & B');
  });

  it('leaves unknown entities as-is', () => {
    expect(stripHtmlAndGetFirstParagraph('&copy; City')).toBe('&copy; City');
  });

  it('collapses runs of whitespace', () => {
    expect(stripHtmlAndGetFirstParagraph('<p>a   b\t c</p>')).toBe('a b c');
  });
});

describe('validateUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubFetch = (impl: () => Promise<Partial<Response>>) => {
    const fetchMock = vi.fn(impl);
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  };

  it.each([null, undefined, ''])('returns false for %j', async (input) => {
    expect(await validateUrl(input)).toBe(false);
  });

  it('returns false for a malformed URL without fetching it', async () => {
    const fetchMock = stubFetch(async () => ({ ok: true }));
    expect(await validateUrl('not a url')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns true when a HEAD request succeeds', async () => {
    const fetchMock = stubFetch(async () => ({ ok: true }));
    expect(await validateUrl('https://example.com')).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
      method: 'HEAD',
    });
  });

  it('returns false when the server responds with an error', async () => {
    stubFetch(async () => ({ ok: false }));
    expect(await validateUrl('https://example.com/missing')).toBe(false);
  });

  it('returns false when the request fails', async () => {
    stubFetch(async () => {
      throw new Error('network down');
    });
    expect(await validateUrl('https://example.com')).toBe(false);
  });
});
