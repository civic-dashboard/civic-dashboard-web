The TypeScript code parseQuery.ts takes a string input, parses it and converts it into a format compatible with PostgreSQL’s full text search - (https://www.postgresql.org/docs/current/textsearch.html)
1.	Convert the query string into a structured data tree
2.	Transform that tree into a PostgreSQL-specific query syntax.
________________________________________

# Key Concepts

## The Data Structures
The code defines two primary data types to represent the search query in different stages of parsing.
1. `Token`: This type represents the most basic components of a search query, such as individual words, parentheses, and logical operators (and, or, -). It's the first step in processing the raw string.
2. `Query`: This is a recursive type that represents the logical structure of the search. A Query can be a single token, a group of queries combined by ‘and’ or ‘or’, or a ‘not’ query. This tree-like structure makes it easy to handle complex groupings and logical relationships.

## The Process
The entire process can be broken down into three main stages:
`Tokenization`: The tokenize function takes a raw search string and converts it into an array of Token objects. It handles quoted strings (e.g., "public housing"), parentheses, and logical operators. This function is the first step in interpreting the user's input.
`Parsing`: The parseTokens function takes the array of Token objects and builds the Query tree structure. It handles operator precedence, nested parentheses, and negation (-).
`Conversion`: The queryToPostgresTextSearchQuery function takes the Query tree and translates it into a string that uses PostgreSQL's full-text search syntax. This includes converting logical operators to their PostgreSQL equivalents (& for and, | for or, and ! for not) and formatting individual words correctly.
________________________________________

# Functions

## const tokenize 
The constant function ‘tokenize’ take a string input as query and returns an array of Tokens.
`.trim()`: Removes leading and trailing whitespace characters
`.toLowerCase()`: Converts the entire query string to lowercase

1.	If the first character of the query is a starting quote, use endQuote funstion to find the index of the closing quote. 
    -	`Closing quote not found`: discard the opening quote and tokenize the string that follows.
    -	`Closing quote found`: drop the quotes and mark the string as a token. Tokenize the string that follows.
2.	If the first character of the query is a parenthesis (opening or closing), mark the parenthesis as a token. Tokenize the string that follows.
3.	If the first character of the query is a minus sign, check the following character for a white space or end of the string.
    -	If the following character is not a space, mark the minus sign as a token (NOT operator). Tokenize the string that follows.
    -	If the following character is a space, discard the minus sign. Tokenize the string that follows.

## const tokenMatch 
Query.match() uses a regex to find the longest sequence of characters that is not a parenthesis, a quote, or whitespace from the beginning of the query string. This is used to capture the next word or term. The result is stored in the tokenMatch variable:
•	`If a match is found`: tokenMatch will be an array where index [0] contains the matched term
•	`If no match is found`: tokenMatch will be null

If the query.match() call fails to find any sequence of characters that qualifies as a token, it returns an empty array.
If tokenMatch returns and/or, mark it as a valid token of type itself (a logical operator) and tokenize the remaining string.
If tokenMatch returns a string of characters, mark it as a valid token of type string and tokenize the remaining string.

`The Regex`: ^[^()"\s]+
-	^: Asserts the match must occur at the start of the string.
-	[^()"\s]: This is a negated character set. It matches any single character that is NOT any of the following:
            1. ( : Opening parenthesis
            2. ) : Closing parenthesis
            3. " : Double quote
            4. \s : Any whitespace character (space, tab, newline)
            5. +: Asserts that the preceding character set must match one or more times.

## const findEndParen 
The function findEndParen locates the index of the matching closing parenthesis ‘)’ for an initial opening parenthesis ‘(‘, in the search query. It uses stack balancing to identify and isolate logical groups within the query.
-	if an opening parenthesis (() is encountered, the parenStack is incremented (++). This signifies a new nested group has started, and a new closing parenthesis will be needed to balance it.
-	If a closing parenthesis ()) is encountered, the parenStack is decremented (--). This signifies one of the pending opening parentheses has been matched.

If parenStack reaches 0, it means that the current closing parenthesis (at index i) has balanced the initial count of 1 (plus any nested pairs encountered). The function retuens the index of the closing parenthesis.
If the loop completes without parenStack reaching 0, it means the closing parenthesis was not found, indicating a syntax error (an unbalanced opening parenthesis). The function returns -1.

## const parseTokens 
The function parseTokens takes as input an array of Token objects (output from tokenizer) and converts it into Query type.

## const queryToPostgresTextSearchQuery 
The function queryToPostgresTextSearchQuery takes as input the query produced by parseTokens

## const queryAndTagsToPostgresTextSearchQuery 
The function queryAndTagsToPostgresTextSearchQuery creates a PostgreSQL tsquery string by combining a user's text search query with the associated search logic.
`TagEnum[]` holds the string values that corresponds to the keys in the allTags object defined in the code available at below link.
