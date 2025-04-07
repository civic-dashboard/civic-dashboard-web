import { DB } from '@/database/allDbTypes';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';
import { SearchPagination } from '@/logic/search';
import { Kysely, QueryCreator, sql } from 'kysely';

import { AgendaItem, Motion } from '@/app/councillors/[contactSlug]/types';

type SearchOptions = { searchString: string; contactSlug: string };

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
  db: QueryCreator<DB>,
  options: SearchOptions,
) {
  const fuzzyQuery = queryAndTagsToPostgresTextSearchQuery({
    textQuery: options.searchString,
    tags: [],
  });

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

function nestMotionsUnderAgendaItems(
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

export async function getVotesByAgendaItemsForContact(
  db: Kysely<DB>,
  contactSlug: string,
  searchString: string | null,
): Promise<AgendaItem[]> {
  const baseQuery = buildCouncillorVotesSearchResultsQuery(db, {
    searchString: searchString ?? '',
    contactSlug,
  })
    .with('OriginalSummaries', (eb) =>
      eb
        .selectFrom('RawAgendaItemConsiderations')
        .select(['reference', 'agendaItemSummary'])
        .distinct(),
    )
    .with('AutoSummaries', (eb) =>
      eb
        .selectFrom('AiSummaries')
        .groupBy('AiSummaries.agendaItemNumber')
        .having(sql<number>`count(*)`, '=', 1)
        .select([
          'AiSummaries.agendaItemNumber',
          sql<string>`MIN("summary")`.as('aiSummary'),
        ]),
    )
    .selectFrom('Votes')
    .innerJoin('Motions', (eb) =>
      eb
        .onRef('Votes.agendaItemNumber', '=', 'Motions.agendaItemNumber')
        .onRef('Votes.motionId', '=', 'Motions.motionId'),
    )
    .innerJoin('AgendaItems', (eb) =>
      eb.onRef('Votes.agendaItemNumber', '=', 'AgendaItems.agendaItemNumber'),
    )
    .innerJoin('Committees', (eb) =>
      eb.onRef('Committees.committeeSlug', '=', 'Motions.committeeSlug'),
    )
    .leftJoin('OriginalSummaries', (eb) =>
      eb.onRef(
        'AgendaItems.agendaItemNumber',
        '=',
        'OriginalSummaries.reference',
      ),
    )
    .leftJoin('AutoSummaries', (eb) =>
      eb.onRef(
        'AgendaItems.agendaItemNumber',
        '=',
        'AutoSummaries.agendaItemNumber',
      ),
    )
    .select([
      'AgendaItems.agendaItemNumber',
      'AgendaItems.agendaItemTitle',
      'Motions.motionType',
      'Motions.motionId',
      'Motions.voteDescription',
      'Motions.dateTime',
      'Motions.committeeSlug',
      'Motions.result',
      'Motions.resultKind',
      sql<string>`CONCAT("Motions"."yesVotes", '-', "Motions"."noVotes")`.as(
        'tally',
      ),
      'Votes.value',
      'Committees.committeeName',
      'OriginalSummaries.agendaItemSummary',
      'AutoSummaries.aiSummary',
    ]);

  let flatRows: FlatRow[];
  if (searchString) {
    flatRows = await baseQuery
      .innerJoin('SearchResults', (eb) =>
        eb.onRef(
          'AgendaItems.agendaItemNumber',
          '=',
          'SearchResults.agendaItemNumber',
        ),
      )
      .orderBy('SearchResults.rank', 'desc')
      .execute();
  } else {
    flatRows = await baseQuery
      .where('Votes.contactSlug', '=', contactSlug)
      .orderBy('Motions.dateTime', 'desc')
      .execute();
  }

  return nestMotionsUnderAgendaItems(flatRows);
}
