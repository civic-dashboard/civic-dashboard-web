/*
 * IMPORTANT NOTE:
 * Search subscriptions have their parsed queries baked into
 * database row for each search subscription so that we can query
 * against those rows without having to bring data back into the
 * application layer. There is a pipeline in GitHub which runs
 * on every merge to main to keep prod in sync, so hopefully this
 * doesn't require manual intervention but it's good to be aware
 * of when modifying these definitions.
 */

import { allTags, TagEnum } from '@/constants/tags';

type Query =
  | {
      type: 'token';
      token: string;
    }
  | { type: 'and' | 'or'; queries: Query[] }
  | { type: 'not'; query: Query };

type Token =
  | {
      type: '(' | ')' | 'and' | 'or' | '-';
    }
  | { type: 'string'; string: string };

const tokenize = (query: string): Token[] => {
  query = query.trim().toLowerCase();
  if (query.length === 0) {
    return [];
  }
  if (query[0] === '"') {
    const endQuote = query.slice(1).indexOf('"');
    if (endQuote === -1) {
      return tokenize(query.slice(1));
    }
    return [
      { type: 'string', string: query.slice(1, endQuote + 1) },
      ...tokenize(query.slice(endQuote + 2)),
    ];
  }
  if (query[0] === '(' || query[0] === ')') {
    return [{ type: query[0] }, ...tokenize(query.slice(1))];
  }
  if (query[0] === '-') {
    if (query.slice(1).match(/^[^\s]/)) {
      return [{ type: '-' }, ...tokenize(query.slice(1))];
    }
    return tokenize(query.slice(1));
  }

  const tokenMatch = query.match(/^[^()"\s]+/);
  if (tokenMatch === null) {
    return [];
  }
  const remaining = query.slice(tokenMatch[0].length);

  if (tokenMatch[0] === 'and' || tokenMatch[0] === 'or') {
    return [{ type: tokenMatch[0] }, ...tokenize(remaining)];
  }

  return [{ type: 'string', string: tokenMatch[0] }, ...tokenize(remaining)];
};

const startsGroup = (token: Token) =>
  token.type === 'string' || token.type === '(' || token.type === '-';

const findEndParen = (tokens: Token[]) => {
  let parenStack = 1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === '(') parenStack++;
    if (tokens[i].type === ')') parenStack--;
    if (parenStack === 0) return i;
  }
  return -1;
};

const parseTokens = (tokens: Token[]): Query | null => {
  if (tokens.length === 0) {
    return null;
  }

  if (!startsGroup(tokens[0])) {
    return parseTokens(tokens.slice(1));
  }

  let initialGroup: Query | null = null;
  let remaining: Token[] = [];
  if (tokens[0].type === 'string') {
    initialGroup = { type: 'token', token: tokens[0].string };
    remaining = tokens.slice(1);
  } else if (tokens[0].type === '(') {
    const endParen = findEndParen(tokens.slice(1));
    if (endParen === -1) {
      return parseTokens(tokens.slice(1));
    }
    const subQuery = parseTokens(tokens.slice(1, endParen));
    if (subQuery === null) {
      return parseTokens(tokens.slice(endParen + 1));
    }
    initialGroup = subQuery;
    remaining = tokens.slice(endParen + 1);
  } else if (tokens[0].type === '-') {
    if (tokens.length === 1) {
      return null;
    } else if (tokens[1].type === 'string') {
      initialGroup = {
        type: 'not',
        query: { type: 'token', token: tokens[1].string },
      };
      remaining = tokens.slice(2);
    } else if (tokens[1].type === '(') {
      const endParen = findEndParen(tokens.slice(2));
      if (endParen === -1) {
        return parseTokens(tokens.slice(2));
      }
      const subQuery = parseTokens(tokens.slice(2, endParen));
      if (subQuery === null) return parseTokens(tokens.slice(endParen + 1));
      initialGroup = {
        type: 'not',
        query: subQuery,
      };
      remaining = tokens.slice(endParen + 1);
    } else {
      return parseTokens(tokens.slice(1));
    }
  }

  if (remaining.length === 0) {
    return initialGroup;
  }

  if (initialGroup === null) {
    return parseTokens(remaining);
  }

  if (remaining[0].type === 'and' || remaining[0].type === 'or') {
    const rest = parseTokens(remaining.slice(1));
    if (rest === null) return initialGroup;
    return { type: remaining[0].type, queries: [initialGroup, rest] };
  }

  const rest = parseTokens(remaining);
  if (rest === null) return initialGroup;
  return { type: 'and', queries: [initialGroup, rest] };
};

const queryToPostgresTextSearchQuery = (query: Query): string => {
  if (query.type === 'token') {
    const splitTokens = query.token
      .split(/\s+/)
      .map((s) => s.replaceAll(/['"]/g, '')) // having apostrophes or quotes in individual search tokens will break postgres's text search
      .map((s) => `'${s}'`);

    return `(${splitTokens.join('<->')})`;
  }

  if (query.type === 'not') {
    return `!(${queryToPostgresTextSearchQuery(query.query)})`;
  }

  const op = query.type === 'and' ? '&' : '|';
  const subqueries = query.queries.map((subquery) =>
    queryToPostgresTextSearchQuery(subquery),
  );
  return `(${subqueries.join(op)})`;
};

const parseQuery = (query: string) => parseTokens(tokenize(query));

export const queryAndTagsToPostgresTextSearchQuery = ({
  textQuery,
  tags,
}: {
  textQuery: string;
  tags: TagEnum[];
}) => {
  const parsedTextQuery = parseQuery(textQuery);
  const parsedTagQueries = tags
    .map((tag) => parseQuery(allTags[tag].searchQuery))
    .filter((q) => q !== null);

  const tagPart: Query | null =
    parsedTagQueries.length === 0
      ? null
      : { type: 'or', queries: parsedTagQueries };

  const allParts = [parsedTextQuery, tagPart].filter((q) => q !== null);

  const fullQuery: Query | null =
    allParts.length === 0
      ? null
      : allParts.length === 1
        ? allParts[0]
        : { type: 'and', queries: allParts };

  return fullQuery === null ? null : queryToPostgresTextSearchQuery(fullQuery);
};
