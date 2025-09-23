import { describe, it, expect } from 'vitest';
import {
  toQueryString,
  fromQueryString,
  paramNames,
} from '@/contexts/SearchContext';
import type { SearchOptions } from '@/logic/search';
import { TagEnum } from '@/constants/tags';

describe('toQueryString', () => {
  it('should omit empty fields and trim query strings', () => {
    // Arrange
    const rawTextQuery = '   bike lanes   ';
    const expectedTrimmedQuery = 'bike lanes';
    const tags: TagEnum[] = [];
    const decisionBodyIds: number[] = [];
    const minimumDate = undefined;

    const opts: SearchOptions = {
      textQuery: rawTextQuery,
      tags,
      decisionBodyIds,
      minimumDate,
    };

    // Act
    const queryString = toQueryString(opts);
    const params = new URLSearchParams(queryString);

    // Assert
    expect(params.get(paramNames.query)).toBe(expectedTrimmedQuery);
    expect(params.getAll(paramNames.tags)).toEqual(tags);
    expect(params.getAll(paramNames.decisionBodyIds)).toEqual(
      decisionBodyIds.map(String),
    );
    expect(params.get(paramNames.minimumDate)).toBeNull();
  });
  it('should serialize tags, decisionBodyIds, and minimumDate (yyyy-mm-dd)', () => {
    // Arrange
    const textQuery = 'arctic';
    const tags: TagEnum[] = ['climate', 'transit'];
    const decisionBodyIds: number[] = [2463, 2464, 2462];
    const minimumDate = new Date('2025-09-21T12:34:56Z');

    const opts: SearchOptions = {
      textQuery,
      tags,
      decisionBodyIds,
      minimumDate,
    };

    // Act
    const queryString = toQueryString(opts);
    const params = new URLSearchParams(queryString);

    // Assert
    expect(params.get(paramNames.query)).toBe(textQuery);
    expect(params.getAll(paramNames.tags)).toEqual(tags);
    expect(params.getAll(paramNames.decisionBodyIds)).toEqual(
      decisionBodyIds.map(String),
    );
    expect(params.get(paramNames.minimumDate)).toBe(
      minimumDate.toISOString().slice(0, 10),
    );
  });
  it('should properly encode values but round-trip them', () => {
    // Arrange
    const textQuery = 'bikes & buses / “pilot”';
    const tags: TagEnum[] = ['housing', 'homelessness', 'transit'];
    const decisionBodyIds: number[] = [1, 200, 3001];
    const minimumDate = new Date('2025-01-02T08:09:10Z');
    const opts: SearchOptions = {
      textQuery: textQuery,
      tags: tags,
      decisionBodyIds: decisionBodyIds,
      minimumDate: minimumDate,
    };

    // Act
    const qs = toQueryString(opts);
    const params = new URLSearchParams(qs);

    // Assert (URL encoding/decoding via URLSearchParams)
    expect(params.get(paramNames.query)).toBe(textQuery);
    expect(params.getAll(paramNames.tags)).toEqual(tags);
    expect(params.getAll(paramNames.decisionBodyIds)).toEqual(
      decisionBodyIds.map(String),
    );
    expect(params.get(paramNames.minimumDate)).toBe(
      minimumDate.toISOString().slice(0, 10),
    );

    // Full round-trip via fromQueryString:
    const parsed = fromQueryString(qs, {});
    expect(parsed.textQuery).toBe(textQuery);
    expect(parsed.tags).toEqual(tags);
    expect(parsed.decisionBodyIds).toEqual(decisionBodyIds);
    // Compare date-only equality (time is intentionally dropped by
    // toQueryString)
    expect(parsed.minimumDate?.toISOString().slice(0, 10)).toBe(
      minimumDate.toISOString().slice(0, 10),
    );
  });
});

describe('fromQueryString', () => {
  it('should parse repeated params and date into a date object', () => {
    // Arrange
    const textQuery = 'foo';
    const tags: TagEnum[] = ['housing', 'transit'];
    const decisionBodyIds: number[] = [1, 2];
    const minimumDate = new Date('2025-01-02T03:04:05Z');
    const minDateStr = minimumDate.toISOString().slice(0, 10);
    const qs =
      `?${paramNames.query}=${encodeURIComponent(textQuery)}` +
      `&${tags.map((t: TagEnum) => `${paramNames.tags}=${encodeURIComponent(t)}`).join('&')}` +
      `&${decisionBodyIds.map((id: number) => `${paramNames.decisionBodyIds}=${id}`).join('&')}` +
      `&${paramNames.minimumDate}=${minDateStr}`;

    // Act
    const parsed = fromQueryString(qs, {});

    // Assert
    expect(parsed.textQuery).toBe(textQuery);
    expect(parsed.tags).toEqual(tags);
    expect(parsed.decisionBodyIds).toEqual(decisionBodyIds);
    expect(parsed.minimumDate).toBeInstanceOf(Date);
    expect(parsed.minimumDate?.toISOString().slice(0, 10)).toBe(minDateStr);
  });

  it('should handle empty query string', () => {
    // Arrange
    const qs = '';

    // Act
    const parsed = fromQueryString(qs, {});

    // Assert
    expect(parsed.textQuery).toBeUndefined();
    expect(parsed.tags).toEqual([]);
    expect(parsed.decisionBodyIds).toEqual([]);
    expect(parsed.minimumDate).toBeUndefined();
  });

  it('should round-trip typical options', () => {
    // Arrange
    const textQuery = ' transit map ';
    const tags: TagEnum[] = ['housing', 'safety'];
    const decisionBodyIds: number[] = [10, 11];
    const minimumDate = new Date('2025-05-15T20:30:00Z');
    const original: SearchOptions = {
      textQuery,
      tags,
      decisionBodyIds,
      minimumDate,
    };

    // Act
    const qs = toQueryString(original);
    const parsed = fromQueryString(qs);

    // Assert
    // toQueryString trims the text; parsed should match the trimmed value
    expect(parsed.textQuery).toBe(textQuery.trim());
    expect(parsed.tags).toEqual(tags);
    expect(parsed.decisionBodyIds).toEqual(decisionBodyIds);
    expect(parsed.minimumDate?.toISOString().slice(0, 10)).toBe(
      minimumDate.toISOString().slice(0, 10),
    );
  });
});

