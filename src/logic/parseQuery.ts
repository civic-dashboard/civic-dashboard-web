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

type Query =
  | {
      type: 'token';
      token: string;
    }
  | { type: 'and' | 'or'; queries: Query[] }
  | { type: 'not'; query: Query };

/* Query can be one of the following types:
 *   -	Smallest possible query, a ‘Token’
 *   -	An array of query objects
 *   -	A negative query
 */

type Token =
  | {
      type: '(' | ')' | 'and' | 'or' | '-';
    }
  | { type: 'string'; string: string };

/* Token represents the individual components of the input string
 *   -	Fixed value: (,), and, or, -
 *   -	Variable value of type string
 */

const tokenize = (query: string): Token[] => {
  query = query.trim().toLowerCase();
  if (query.length === 0) {
    //if length of the query is 0, the array is empty
    return [];
  }
  if (query[0] === '"') {
    //If an opening quote is found, search the closing quote
    const endQuote = query.slice(1).indexOf('"');
    //endQuote returns the index of a closing quote when found

    if (endQuote === -1) {
      return tokenize(query.slice(1));
    }
    //No closing quote found, drop the opening quote and tokenize the string

    return [
      { type: 'string', string: query.slice(1, endQuote + 1) }, //quotes dropped,query token returned
      ...tokenize(query.slice(endQuote + 2)), //tokenize the query that follows closing quote
    ];
  }
  if (query[0] === '(' || query[0] === ')') {
    return [{ type: query[0] }, ...tokenize(query.slice(1))];
  }
  //if the current character is ‘(‘ or ‘)’, tokenize the query that follows the character

  if (query[0] === '-') {
    //if the current character is a minus sign
    if (query.slice(1).match(/^[^\s]/)) {
      //and if the following character is not a space
      return [{ type: '-' }, ...tokenize(query.slice(1))];
    } //‘-‘ is marked as a token and tokenize the query that follows minus sign
    return tokenize(query.slice(1));
  } //discard the ‘-‘ and tokenize the query that follows minus sign

  const tokenMatch = query.match(/^[^()"\s]+/); //Use regex to find the next search term
  if (tokenMatch === null) {
    //sequence of characters not found
    return [];
  }
  const remaining = query.slice(tokenMatch[0].length);
  //create a new string removing the valid token captured in tokenMatch

  if (tokenMatch[0] === 'and' || tokenMatch[0] === 'or') {
    //if tokenMatch returns and/or
    return [{ type: tokenMatch[0] }, ...tokenize(remaining)];
  }

  return [{ type: 'string', string: tokenMatch[0] }, ...tokenize(remaining)];
}; //if tokenMatch returns a string

const startsGroup = (token: Token) =>
  token.type === 'string' || token.type === '(' || token.type === '-';
/* Takes as input ‘Token’ and returns true if the token's type is one of three:
 * String
 * Opening parenthesis
 * Minus sign
 */

const findEndParen = (tokens: Token[]) => {
  //input the Token array
  let parenStack = 1; //initialize the stack value at 1
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === '(') parenStack++;
    if (tokens[i].type === ')') parenStack--;
    if (parenStack === 0) return i; //i is the index of matching closing parenthesis
  }
  return -1; //closing parenthesis not found
};

const parseTokens = (tokens: Token[]): Query | null => {
  if (tokens.length === 0) {
    return null;
  } //if Token[] is empty, return null

  if (!startsGroup(tokens[0])) {
    return parseTokens(tokens.slice(1));
  } //if the first element of Token[] is not a valid value as per startsGroup function , skip it

  let initialGroup: Query | null = null;
  // initialize variable initialGroup with value null
  // it can hold values of type Query or null

  let remaining: Token[] = [];
  // initialize variable remaining as an empty array
  // it can hold an array of Token objects

  if (tokens[0].type === 'string') {
    initialGroup = { type: 'token', token: tokens[0].string };
    remaining = tokens.slice(1);
  } else if (tokens[0].type === '(') {
    /* If the current element of token is a string (a valid search term)
     * Set the value of variable InitialGroup as the string value inside token[0]
     * Set the value of remaining to a new array that contains all tokens except the first one.
     */
    //If the current element is ‘(‘, call endParen to find ‘)’
    const endParen = findEndParen(tokens.slice(1));
    if (endParen === -1) {
      //‘)’ not found, discard ‘(‘ and parse the remaining string
      return parseTokens(tokens.slice(1));
    }

    const subQuery = parseTokens(tokens.slice(1, endParen));
    if (subQuery === null) {
      return parseTokens(tokens.slice(endParen + 1));
    }
    // input the tokens between the parentheses
    // if there’s no token between the parentheses, skip past ‘)’ and parse the remaining tokens

    initialGroup = subQuery;
    remaining = tokens.slice(endParen + 1);
  } else if (tokens[0].type === '-') {
    if (tokens.length === 1) {
      return null; //return null if ‘-‘ is the only token in the array
    } else if (tokens[1].type === 'string') {
      initialGroup = {
        type: 'not',
        query: { type: 'token', token: tokens[1].string },
      };
      // if token[1] is a string and the first token is ‘-‘(NOT operator)
      // the query takes the value of type  ‘not(token[1].string)’

      remaining = tokens.slice(2);
    } else if (tokens[1].type === '(') {
      const endParen = findEndParen(tokens.slice(2));
      if (endParen === -1) {
        return parseTokens(tokens.slice(2));
      }
      // if token[1] is an opening parenthesis call endParen to find the closing parenthesis
      // if closing parenthesis is not found, skip both ‘-‘ and ‘(‘

      const subQuery = parseTokens(tokens.slice(2, endParen));
      if (subQuery === null) return parseTokens(tokens.slice(endParen + 1));
      // if there are no tokens between parentheses, parse the toekns after ‘)’
      initialGroup = {
        // if subquery has a valid value
        type: 'not',
        query: subQuery,
      }; // set value of initialGroup as NOT(subQuery)
      remaining = tokens.slice(endParen + 1);
    } else {
      return parseTokens(tokens.slice(1));
    } // if the token following ‘-‘ is neither a string nor a ‘(‘, skip the minus sign
  }

  if (remaining.length === 0) {
    return initialGroup;
  } // if the array ‘remaining’ is empty, return the value of initialGroup

  if (initialGroup === null) {
    return parseTokens(remaining);
  } // if the value of initialGroup is null, parse the ‘remaining’ tokens

  if (remaining[0].type === 'and' || remaining[0].type === 'or') {
    const rest = parseTokens(remaining.slice(1));
    if (rest === null) return initialGroup;
    return { type: remaining[0].type, queries: [initialGroup, rest] };
  }
  /* if the current token is a logical operator and/or, check the following token
   * if the next token is null, return the left-hand operand as it has no valid right-hand operand
   * else return the set: left-hand operand (initialGroup) and right-hand operand (rest)
   */

  const rest = parseTokens(remaining);
  if (rest === null) return initialGroup;
  return { type: 'and', queries: [initialGroup, rest] };
}; //If both the left side (initialGroup) and the right side (rest) are valid, set type: 'and'

const queryToPostgresTextSearchQuery = (query: Query): string => {
  if (query.type === 'token') {
    const splitTokens = query.token
      .split(/\s+/) // split tokens by white spaces (/\s+/) into individual words.
      .map((s) => s.replaceAll(/['"]/g, '')) // having apostrophes or quotes in individual search tokens will break postgres's text search
      .map((s) => `'${s}'`); // wrap each word in single quotes ('${s}'), to represent a lexeme

    return `(${splitTokens.join('<->')})`; // join each lexeme by <−> operator
  }

  if (query.type === 'not') {
    return `!(${queryToPostgresTextSearchQuery(query.query)})`;
  } // for a query with NOT operation, extract the query string value and prepend it with ‘!’

  const op = query.type === 'and' ? '&' : '|'; // map 'and' to & and 'or' maps to |
  const subqueries = query.queries.map(
    (subquery) => queryToPostgresTextSearchQuery(subquery), // extract query strings from subquery
  );
  return `(${subqueries.join(op)})`; // join the sub-query strings using operators (& or |)
};

const parseQuery = (query: string) => parseTokens(tokenize(query));
// query(raw input) -> tokenize -> parse
// Returns the resulting AST (abstract syntax tree

export const textQueryToPostgresTextSearchQuery = (textQuery: string) => {
  const parsedTextQuery = parseQuery(textQuery);
  return parsedTextQuery === null
    ? null
    : queryToPostgresTextSearchQuery(parsedTextQuery);
};
