import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';

const toTsQuery = (textQuery: string) =>
  queryAndTagsToPostgresTextSearchQuery({ textQuery, tags: [] });

describe('queryAndTagsToPostgresTextSearchQuery', () => {
  it('builds a phrase query from a quoted phrase', () => {
    assert.equal(toTsQuery('"bike lanes"'), `('bike'<->'lanes')`);
  });

  it('strips apostrophes inside a word', () => {
    assert.equal(toTsQuery("don't"), `('dont')`);
  });

  it('escapes backslashes', () => {
    assert.equal(toTsQuery('foo\\'), `('foo\\\\')`);
  });

  it('returns null for a word made only of quotes', () => {
    assert.equal(toTsQuery("'"), null);
  });

  it('drops an empty quoted phrase', () => {
    assert.equal(toTsQuery('"" bikes'), `('bikes')`);
  });

  it('drops empty words at the edges of a quoted phrase', () => {
    assert.equal(toTsQuery('" bikes "'), `('bikes')`);
  });

  it('drops a negated word made only of quotes', () => {
    assert.equal(toTsQuery("-' bikes"), `('bikes')`);
  });
});
