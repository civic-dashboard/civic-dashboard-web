import { Address, TMMISAgendaItem } from '@/api/agendaItem';
import { TagEnum } from '@/constants/tags';
import { DB, JsonArray } from '@/database/allDbTypes';
import { agendaItemConflictColumns } from '@/database/columns';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';
import { Kysely, sql } from 'kysely';

export interface AgendaItem {
  id: string;
  termId: number;
  agendaItemId: number;
  councilAgendaItemId: number;
  decisionBodyId: number;
  meetingId: number;
  itemProcessId: number;
  decisionBodyName: string;
  meetingDate: number;
  reference: string;
  termYear: string;
  agendaCd: string;
  meetingNumber: string;
  itemStatus: string;
  agendaItemTitle: string;
  agendaItemSummary: string;
  agendaItemRecommendation: string | null;
  decisionRecommendations: string | null;
  decisionAdvice: string | null;
  subjectTerms: string;
  wardId: number[] | null;
  backgroundAttachmentId: number[] | null;
  agendaItemAddress: Address[] | null;
  address: string[] | null;
  geoLocation: string[] | null;
  planningApplicationNumber: string | null;
  neighbourhoodId: number[] | null;
}

export const insertAgendaItems = async (
  db: Kysely<DB>,
  items: TMMISAgendaItem[],
) => {
  const asDBType = items.map(({ id: _, agendaItemAddress, ...item }) => ({
    ...item,
    agendaItemAddress: agendaItemAddress as unknown as JsonArray,
  }));

  // kinda convoluted upsert but it gets the job done 🤷:

  // for ez idempotent updates, it makes sense to just re-insert
  // all the data from the previous to next month (rather than trying
  // to compare whether the data needs updating, or risk inserting duplicate rows).

  // since agenda item considerations can change over time
  // (most notably, before/after the council actually votes on it)
  // we need to run an ON CONFLICT clause in the INSERT query,
  // which requires a UNIQUE constraint on the columns specified in the ON CONFLICT clause

  // that UNIQUE constraint (mostly) holds over the source data set, but there were a
  // couple instances of it not being true. in those instances, the only way to differentiate
  // the two agenda items is using `agendaItemId`, because they have the same reference,
  // same meeting ID, same meeting time, etc.

  // the newer one (by inspection of relevant columns that might not be possible to automate) had a higher agendaItemId.
  // if agendaItemId is tied we take the fresh values

  // all of this is just best effort to get the thing off the ground and we can refine later

  return await db
    .insertInto('RawAgendaItemConsiderations')
    .onConflict((onConflict) =>
      onConflict.columns(['reference', 'meetingId']).doUpdateSet((eb) =>
        Object.fromEntries(
          agendaItemConflictColumns
            .filter((column) => column !== 'id')
            .map((column) => [
              column,
              eb
                .case()
                .when(
                  'RawAgendaItemConsiderations.agendaItemId',
                  '<=',
                  eb.ref('excluded.agendaItemId'),
                )
                .then(eb.ref(`excluded.${column}`))
                .else(eb.ref(`RawAgendaItemConsiderations.${column}`))
                .end(),
            ]),
        ),
      ),
    )
    .values(asDBType)
    .execute();
};

export const sortByOptions = ['date', 'relevance'] as const;
export type SortByOption = (typeof sortByOptions)[number];
export const sortDirectionOptions = ['ascending', 'descending'] as const;
export type SortDirectionOption = (typeof sortDirectionOptions)[number];

type AgendaItemSearchOptions = {
  page: number;
  pageSize: number;
  textQuery: string;
  tags: TagEnum[];
  decisionBodyId?: number;
  termId?: number;
  sortBy: SortByOption;
  sortDirection: SortDirectionOption;
  minimumDate?: number;
  maximumDate?: number;
};
export const searchAgendaItems = async (
  db: Kysely<DB>,
  {
    page,
    pageSize,
    textQuery,
    tags,
    decisionBodyId,
    termId,
    sortBy,
    sortDirection,
    minimumDate,
    maximumDate,
  }: AgendaItemSearchOptions,
) => {
  const postgresQuery = queryAndTagsToPostgresTextSearchQuery({
    textQuery,
    tags,
  });

  const commonTables = db
    .with('mostRecentConsiderations', (db) =>
      db
        .selectFrom('RawAgendaItemConsiderations')
        .selectAll()
        .distinctOn('reference')
        .orderBy('reference', 'asc')
        .orderBy('meetingDate', 'desc'),
    )
    .with('query', (db) =>
      db.selectNoFrom(sql`to_tsquery(${postgresQuery})`.as('query')),
    )
    .with('filteredAgendaItems', (db) => {
      let query = db
        .selectFrom(['mostRecentConsiderations', 'query'])
        .select(agendaItemConflictColumns)
        .$if(Boolean(postgresQuery), (query) =>
          query.select(sql`ts_rank("textSearchVector", query)`.as('rank')),
        );

      if (decisionBodyId !== undefined) {
        query = query.where('decisionBodyId', '=', decisionBodyId);
      }

      if (termId !== undefined) {
        query = query.where('termId', '=', termId);
      }

      if (postgresQuery) {
        query = query.whereRef('textSearchVector', '@@', 'query');
      }

      if (minimumDate !== undefined) {
        query = query.where('meetingDate', '>=', minimumDate.toString());
      }

      if (maximumDate !== undefined) {
        query = query.where('meetingDate', '<=', maximumDate.toString());
      }

      return query;
    });

  const totalCount = (
    await commonTables
      .selectFrom('filteredAgendaItems')
      .select(sql<number>`COUNT(*)`.as('count'))
      .executeTakeFirstOrThrow()
  ).count;

  let query = commonTables
    .selectFrom('filteredAgendaItems')
    .select(agendaItemConflictColumns);

  query = query
    .orderBy(
      sortBy === 'relevance' ? 'rank' : 'meetingDate',
      sortDirection === 'ascending' ? 'asc' : 'desc',
    )
    .limit(pageSize)
    .offset(page * pageSize);

  const rawResults = await query.execute();

  const results: AgendaItem[] = rawResults.map(
    ({ meetingDate, agendaItemAddress, ...result }) => ({
      meetingDate: parseInt(meetingDate),
      agendaItemAddress: agendaItemAddress as Address[] | null,
      ...result,
    }),
  );

  return {
    totalCount,
    page,
    pageSize,
    results,
  };
};
