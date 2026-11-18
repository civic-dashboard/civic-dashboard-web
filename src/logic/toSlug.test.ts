import { describe, expect, it } from 'vitest';
import { toSlug } from '@/logic/toSlug';

describe('toSlug', () => {
  it('lowercases and joins words with dashes', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
  });

  it('trims surrounding whitespace', () => {
    expect(toSlug('  Padded  ')).toBe('padded');
  });

  it('replaces accented characters with plain letters', () => {
    expect(toSlug('Café Montréal')).toBe('cafe-montreal');
  });

  it('collapses dashes and spaces between words', () => {
    expect(toSlug('Ward 25 – Scarborough')).toBe('ward-25-scarborough');
  });

  it('keeps dots, as used in agenda item references', () => {
    expect(toSlug('Item 2026.CC1.1')).toBe('item-2026.cc1.1');
  });

  it('spells out ampersands and drops slashes', () => {
    expect(toSlug('a/b&c')).toBe('abandc');
  });

  it('throws on an empty string', () => {
    expect(() => toSlug('')).toThrow('Cannot slugify empty string');
  });

  it('throws on whitespace-only input', () => {
    expect(() => toSlug('   ')).toThrow('Cannot slugify pure whitespace');
  });

  it('throws when nothing sluggable is left', () => {
    expect(() => toSlug('🙂')).toThrow('produced empty string');
  });
});
