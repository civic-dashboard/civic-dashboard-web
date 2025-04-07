import { DB } from '@/database/allDbTypes';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';
import { SearchPagination } from '@/logic/search';
import { Kysely, sql } from 'kysely';

type SearchAgendaItemArgs = {
  options: { textQuery: string; contactSlug: string };
  pagination: SearchPagination;
};

export const searchCouncillorVotes = async (
  db: Kysely<DB>,
  {
    options: { textQuery, contactSlug },
    pagination: { page, pageSize },
  }: SearchAgendaItemArgs,
) => {
  const fuzzyQuery = queryAndTagsToPostgresTextSearchQuery({
    textQuery,
    tags: [],
  });

  if (!fuzzyQuery) throw new Error(`No query to run`);

  const baseQuery = db
    .with('AvailableConsiderations', (db) =>
      db
        .selectFrom('RawAgendaItemConsiderations')
        .innerJoin('Votes', (eb) =>
          eb.onRef('reference', '=', 'agendaItemNumber'),
        )
        .select(['textSearchVector', 'agendaItemNumber'])
        .where('contactSlug', '=', contactSlug)
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
