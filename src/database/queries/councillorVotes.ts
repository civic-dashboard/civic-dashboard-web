import { DB } from '@/database/allDbTypes';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';
import { SearchPagination } from '@/logic/search';
import { Kysely, sql } from 'kysely';

import { AgendaItem, Motion } from '@/app/councillors/[contactSlug]/types';

type SearchOptions = { textQuery: string; contactSlug: string };

export const searchCouncillorVotes = async (
  db: Kysely<DB>,
  {
    options,
    pagination: { page, pageSize },
  }: {
    options: SearchOptions;
    pagination: SearchPagination;
  },
) => {
  const baseQuery = buildCouncillorVotesSearchResultsQuery(db, options);

  const totalCount = (
    await baseQuery
      .selectFrom('SearchResults')
      .select(sql<number>`COUNT(*)::double precision`.as('count'))
      .executeTakeFirstOrThrow()
  ).count;

  const query = baseQuery
    .selectFrom('SearchResults')
    .selectAll()
    .orderBy('rank', 'asc')
    .limit(pageSize)
    .offset(page * pageSize);

  const rawResults = await query.execute();

  return {
    totalCount,
    page,
    pageSize,
    results: rawResults,
  };
};

export function buildCouncillorVotesSearchResultsQuery(
  db: Kysely<DB>,
  options: SearchOptions,
) {
  const fuzzyQuery = queryAndTagsToPostgresTextSearchQuery({
    textQuery: options.textQuery,
    tags: [],
  });
  if (!fuzzyQuery) throw new Error(`No query to run`);
  return db
    .with('AvailableConsiderations', (db) =>
      db
        .selectFrom('RawAgendaItemConsiderations')
        .innerJoin('Votes', (eb) =>
          eb.onRef('reference', '=', 'agendaItemNumber'),
        )
        .select(['textSearchVector', 'agendaItemNumber'])
        .where('contactSlug', '=', options.contactSlug)
        .distinct(),
    )
    .with('FuzzyQuery', (db) =>
      db.selectNoFrom(sql`to_tsquery('english', ${fuzzyQuery})`.as('query')),
    )
    .with('SearchResults', (db) =>
      db
        .selectFrom(['AvailableConsiderations', 'FuzzyQuery'])
        .select('agendaItemNumber')
        .select(sql<number>`ts_rank("textSearchVector", query)`.as('rank'))
        .whereRef('textSearchVector', '@@', 'query'),
    );
}

type FlatRow = Omit<AgendaItem & Motion, 'motions'>;
export function nestMotionsUnderAgendaItems(
  flatRows: ReadonlyArray<FlatRow>,
): AgendaItem[] {
  const agendaItemByNumber = new Map<string, AgendaItem>();
  for (const {
    agendaItemNumber,
    agendaItemTitle,
    agendaItemSummary,
    aiSummary,
    ...motion
  } of flatRows) {
    const agendaItem: AgendaItem = agendaItemByNumber.get(agendaItemNumber) ?? {
      agendaItemNumber,
      agendaItemTitle,
      agendaItemSummary,
      aiSummary,
      motions: [],
    };
    agendaItem.motions.push(motion);
    agendaItemByNumber.set(agendaItemNumber, agendaItem);
  }
  return [...agendaItemByNumber.values()];
}
