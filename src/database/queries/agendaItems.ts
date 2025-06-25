import {
  Address,
  TMMISAgendaItem,
  AgendaItemSubjectTerm,
} from '@/api/agendaItem';
import { DB, JsonArray, JsonValue } from '@/database/allDbTypes';
import { agendaItemConflictColumns } from '@/database/columns';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';
import { SearchOptions, SearchPagination } from '@/logic/search';
import { Kysely, sql } from 'kysely';
import { processSubjectTerms } from '@/database/pipelines/textParseUtils';
import { toSlug } from '@/logic/toSlug';

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

type AgendaItemForSubjectTerm = Pick<
  AgendaItem,
  'agendaItemId' | 'subjectTerms'
>;

const cleanAgendaItem = <
  T extends { meetingDate: string; agendaItemAddress: JsonValue },
>({
  meetingDate,
  agendaItemAddress,
  ...rest
}: T) => {
  return {
    meetingDate: parseInt(meetingDate),
    agendaItemAddress: agendaItemAddress as Address[] | null,
    ...rest,
  };
};

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

export const insertAgendaItemSubjectTerms = async (
  db: Kysely<DB>,
  items: AgendaItemSubjectTerm[],
): Promise<AgendaItemSubjectTerm[]> => {
  const uniqueRows = Array.from(
    items
      .reduce((map, obj) => {
        const key = `${obj.agendaItemId}::${obj.subjectTermSlug}`;
        return map.set(key, obj);
      }, new Map())
      .values(),
  );
  return db.transaction().execute(async (trx) => {
    const insertedRows = await trx
      .insertInto('AgendaItemSubjectTerms')
      .values(
        uniqueRows.map(
          ({
            agendaItemId,
            subjectTermRaw,
            subjectTermNormalized,
            subjectTermSlug,
          }) => ({
            agendaItemId,
            subjectTermRaw,
            subjectTermNormalized,
            subjectTermSlug,
          }),
        ),
      )
      .onConflict((oc) =>
        oc.columns(['agendaItemId', 'subjectTermSlug']).doUpdateSet((eb) => ({
          subjectTermRaw: eb.ref('excluded.subjectTermRaw'),
          subjectTermNormalized: eb.ref('excluded.subjectTermNormalized'),
        })),
      )
      .returningAll()
      .execute();
    return insertedRows.length;
  });
};

export function normalizeSubjectTerms(
  agendaItems: TMMISAgendaItem[] | AgendaItemForSubjectTerm[],
): AgendaItemSubjectTerm[] {
  return agendaItems.flatMap((item) => {
    if (!item.subjectTerms) {
      console.log(
        `Skipping agendaItemId ${item.agendaItemId} — empty or missing subjectTerms`,
      );
      return [];
    }
    return processSubjectTerms(item.subjectTerms).map((term) => ({
      agendaItemId: item.agendaItemId,
      subjectTermRaw: term.raw,
      subjectTermNormalized: term.normalized,
      subjectTermSlug: toSlug(term.normalized),
    }));
  });
}

export const processAgendaItemSubjectTerms = async (db: Kysely<DB>) => {
  const deleteResult = await db
    .deleteFrom('AgendaItemSubjectTerms')
    .executeTakeFirst();
  const deletedRows = deleteResult.numDeletedRows || 0;
  console.log(`Deleted ${deletedRows} rows from AgendaItemSubjectTerms.`);

  // Fetch agenda items and process by batchSize sequentially
  let offset = 0;
  // Setting medium batch size
  const batchSize = 2_500;
  let hasMore = true;
  while (hasMore) {
    const agendaItemRecords = await db
      .selectFrom('RawAgendaItemConsiderations')
      .select(['reference', 'meetingId', 'agendaItemId', 'subjectTerms'])
      .limit(batchSize)
      .offset(offset)
      .orderBy('agendaItemId')
      .execute();

    hasMore = agendaItemRecords.length > 0;
    if (!hasMore) break;

    // Normalize subject terms
    const normalizedSubjectTerms = normalizeSubjectTerms(agendaItemRecords);

    if (normalizedSubjectTerms.length > 0) {
      const rowsInserted = await insertAgendaItemSubjectTerms(
        db,
        normalizedSubjectTerms,
      );
      console.log(
        `Processed and inserted ${rowsInserted} subject terms for agenda items.`,
      );
    } else {
      console.log('No subject terms to process for agenda items.');
    }
    offset += batchSize;
  }
};

export const getAgendaItemByReference = async (
  db: Kysely<DB>,
  reference: string,
) => {
  const agendaItem = await db
    .selectFrom('RawAgendaItemConsiderations')
    .selectAll()
    .where('reference', '=', reference)
    .orderBy('meetingDate desc')
    .executeTakeFirst();

  return agendaItem ? cleanAgendaItem(agendaItem) : undefined;
};

type SearchAgendaItemArgs = {
  options: SearchOptions;
  pagination: SearchPagination;
};
export const searchAgendaItems = async (
  db: Kysely<DB>,
  {
    options: {
      textQuery,
      tags,
      decisionBodyIds,
      termId,
      sortBy,
      sortDirection,
      minimumDate,
      maximumDate,
    },
    pagination: { page, pageSize },
  }: SearchAgendaItemArgs,
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
      db.selectNoFrom(sql`to_tsquery('english', ${postgresQuery})`.as('query')),
    )
    .with('filteredAgendaItems', (db) => {
      let query = db
        .selectFrom(['mostRecentConsiderations', 'query'])
        .select(agendaItemConflictColumns)
        .$if(Boolean(postgresQuery), (query) =>
          query.select(sql`ts_rank("textSearchVector", query)`.as('rank')),
        );

      if (decisionBodyIds.length > 0) {
        query = query.where((eb) =>
          eb('decisionBodyId', '=', sql<number>`ANY(${decisionBodyIds})`),
        );
      }

      if (termId !== undefined) {
        query = query.where('termId', '=', termId);
      }

      if (postgresQuery) {
        query = query.whereRef('textSearchVector', '@@', 'query');
      }

      if (minimumDate !== undefined) {
        query = query.where(
          'meetingDate',
          '>=',
          minimumDate.getTime().toString(),
        );
      }

      if (maximumDate !== undefined) {
        query = query.where(
          'meetingDate',
          '<=',
          maximumDate.getTime().toString(),
        );
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
      sortBy === 'relevance' && Boolean(postgresQuery) ? 'rank' : 'meetingDate',
      sortDirection === 'ascending' ? 'asc' : 'desc',
    )
    .limit(pageSize)
    .offset(page * pageSize);

  const rawResults = await query.execute();

  const results: AgendaItem[] = rawResults.map(cleanAgendaItem);

  return {
    totalCount,
    page,
    pageSize,
    results,
  };
};

export const getSubscribersToNotify = async (db: Kysely<DB>) => {
  const rawResults = await db
    .with('newConsiderations', (db) =>
      db
        .selectFrom('RawAgendaItemConsiderations')
        .selectAll()
        .where('notificationSent', '=', false),
    )
    .selectFrom('newConsiderations')
    .innerJoinLateral(
      (db) =>
        db
          .selectFrom('Subscriptions')
          .innerJoin(
            'Subscribers',
            'Subscribers.id',
            'Subscriptions.subscriberId',
          )
          .selectAll('Subscriptions')
          .select(['Subscribers.email', 'Subscribers.unsubscribeToken'])
          .select(
            sql`ts_rank("newConsiderations"."textSearchVector", "Subscriptions"."tsQuery")`.as(
              'rank',
            ),
          )
          .distinctOn('subscriberId')
          .where((eb) =>
            eb.or([
              eb(
                sql<
                  number | null
                >`array_length("Subscriptions"."decisionBodyIds", 1)`,
                'is',
                null,
              ),
              eb(
                'newConsiderations.decisionBodyId',
                '=',
                sql<number>`ANY("Subscriptions"."decisionBodyIds")`,
              ),
            ]),
          )
          .where((eb) =>
            eb.or([
              eb('Subscriptions.tsQuery', 'is', null),
              eb(
                'newConsiderations.textSearchVector',
                '@@',
                eb.ref('Subscriptions.tsQuery'),
              ),
            ]),
          )
          .as('matchingSubscriptions'),
      (join) => join.onTrue(),
    )
    .selectAll(['newConsiderations'])
    .select([
      'matchingSubscriptions.email',
      'matchingSubscriptions.unsubscribeToken',
      'matchingSubscriptions.decisionBodyIds',
      'matchingSubscriptions.tags',
      'matchingSubscriptions.textQuery',
    ])
    .orderBy('matchingSubscriptions.subscriberId')
    .orderBy('matchingSubscriptions.rank desc')
    .execute();

  return rawResults.map(cleanAgendaItem);
};

export const setAgendaItemsToNotified = async (db: Kysely<DB>) => {
  await db
    .updateTable('RawAgendaItemConsiderations')
    .where('notificationSent', '=', false)
    .set('notificationSent', true)
    .execute();
};
