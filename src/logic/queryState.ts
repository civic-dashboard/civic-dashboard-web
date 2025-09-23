import { TagEnum } from '@/constants/tags';
import { SearchOptions } from '@/logic/search';

export const paramNames = {
  query: 'q',
  tags: 'tag',
  decisionBodyIds: 'body',
  minimumDate: 'minDate',
};

/**
 * Converts the given search options into a URL query string for going from
 *  app state to URL.
 *
 * @param {SearchOptions} opts - Search options containing query parameters
 * such as text query, tags, decision body IDs, and minimum date.
 * @return {string} A URL-encoded query string derived from the
 * provided search options.
 */
export function toQueryString(opts: SearchOptions): string {
  const queryParams = new URLSearchParams();
  // if there is a query with text, update the query params
  if (opts.textQuery?.trim())
    queryParams.set(paramNames.query, opts.textQuery.trim());

  // for tags and decision bodies, we add them to the query as repeated params
  for (const t of opts.tags ?? []) queryParams.append(paramNames.tags, t);
  for (const id of opts.decisionBodyIds ?? [])
    queryParams.append(paramNames.decisionBodyIds, id.toString());

  // if there is a minimum date, add it to the query params, format
  //  as yyyy-mm-dd
  if (opts.minimumDate) {
    const date = new Date(opts.minimumDate);
    const yyyMmDd = date.toISOString().slice(0, 10);
    queryParams.set(paramNames.minimumDate, yyyMmDd);
  }
  return queryParams.toString();
}

/**
 * Parses a query string and extracts specific query parameters, used for going
 * from URL to app state.
 *
 * @param {string} queryString - The query string to be parsed.
 * @return {Object} An object containing the parsed query parameters:
 *   - `textQuery`: The value of the 'q' query parameter, if present.
 *   - `tags`: An array of values for the 'tag' query parameter, if present.
 *   - `decisionBodyIds`: An array of numeric values for the 'body'
 *   query parameter.
 *   - `minimumDate`: The parsed date from the 'minDate' query parameter,
 *   if present; otherwise, undefined.
 */
export function fromQueryString(queryString: string): SearchOptions {
  // fetch query params from the URL
  const queryParams = new URLSearchParams(queryString);
  const textQuery: string = queryParams.get(paramNames.query)?.trim() ?? ''; // never undefined
  const tags: TagEnum[] =
    (queryParams.getAll(paramNames.tags) as TagEnum[]) ?? ([] as TagEnum[]);
  const decisionBodyIds: number[] = queryParams
    .getAll('body')
    .map(Number)
    .filter((n) => !Number.isNaN(n));

  const minDateStr: string | null = queryParams.get(paramNames.minimumDate);
  const minimumDate: Date | undefined = minDateStr
    ? new Date(minDateStr)
    : undefined;
  return {
    textQuery,
    tags,
    decisionBodyIds,
    minimumDate,
  };
}
