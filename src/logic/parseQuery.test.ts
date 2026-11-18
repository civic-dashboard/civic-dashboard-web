import { describe, expect, it } from 'vitest';
import { TagEnum } from '@/constants/tags';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';

const toTsQuery = (textQuery: string, tags: TagEnum[] = []) =>
  queryAndTagsToPostgresTextSearchQuery({ textQuery, tags });

describe('queryAndTagsToPostgresTextSearchQuery', () => {
  describe('text queries', () => {
    it('returns null when there is no text and no tags', () => {
      expect(toTsQuery('')).toBeNull();
      expect(toTsQuery('   ')).toBeNull();
    });

    it('turns a single word into a lexeme', () => {
      expect(toTsQuery('housing')).toBe("('housing')");
    });

    it('lowercases input', () => {
      expect(toTsQuery('HOUSING')).toBe("('housing')");
    });

    it('joins separate words with AND', () => {
      expect(toTsQuery('bike lanes')).toBe("(('bike')&('lanes'))");
    });

    it('treats a quoted phrase as words next to each other', () => {
      expect(toTsQuery('"bike lanes"')).toBe("('bike'<->'lanes')");
    });

    it('supports OR', () => {
      expect(toTsQuery('bikes OR cars')).toBe("(('bikes')|('cars'))");
    });

    it('supports explicit AND', () => {
      expect(toTsQuery('bikes and cars')).toBe("(('bikes')&('cars'))");
    });

    it('supports excluding a word with a minus sign', () => {
      expect(toTsQuery('bikes -cars')).toBe("(('bikes')&!(('cars')))");
    });

    it('supports excluding a group', () => {
      expect(toTsQuery('-(cars or trucks)')).toBe("!((('cars')|('trucks')))");
    });

    it('supports grouping with parentheses', () => {
      expect(toTsQuery('(bikes or cars) lanes')).toBe(
        "((('bikes')|('cars'))&('lanes'))",
      );
    });

    it('groups operators from right to left without parentheses', () => {
      expect(toTsQuery('a or b c')).toBe("(('a')|(('b')&('c')))");
    });
  });

  describe('messy input', () => {
    it('strips apostrophes so they cannot break the Postgres query', () => {
      expect(toTsQuery("o'connor")).toBe("('oconnor')");
    });

    it('ignores an unclosed quote', () => {
      expect(toTsQuery('"bike lanes')).toBe("(('bike')&('lanes'))");
    });

    it('ignores an unclosed parenthesis', () => {
      expect(toTsQuery('(bikes or cars')).toBe("(('bikes')|('cars'))");
    });

    it('ignores empty parentheses', () => {
      expect(toTsQuery('() bikes')).toBe("('bikes')");
    });

    it('unwraps redundant parentheses', () => {
      expect(toTsQuery('((bikes))')).toBe("('bikes')");
    });

    it('ignores a leading operator', () => {
      expect(toTsQuery('and bikes')).toBe("('bikes')");
    });

    it('ignores a trailing operator', () => {
      expect(toTsQuery('bikes or')).toBe("('bikes')");
    });

    it('ignores a minus sign followed by a space', () => {
      expect(toTsQuery('- bikes')).toBe("('bikes')");
    });

    it('returns null for operators with no words', () => {
      expect(toTsQuery('and or')).toBeNull();
      expect(toTsQuery('-')).toBeNull();
    });
  });

  describe('tags', () => {
    it('uses the tag query when there is no text', () => {
      expect(toTsQuery('', ['dogs'])).toBe("(('dog'))");
    });

    it('matches any of several tags', () => {
      expect(toTsQuery('', ['dogs', 'parks'])).toBe("(('dog')|('park'))");
    });

    it('requires both the text and the tags to match', () => {
      expect(toTsQuery('leash', ['dogs'])).toBe("(('leash')&(('dog')))");
    });
  });
});
