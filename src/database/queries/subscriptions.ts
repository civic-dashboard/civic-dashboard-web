import { TagEnum } from '@/constants/tags';
import { Kysely, sql } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { queryAndTagsToPostgresTextSearchQuery } from '@/logic/parseQuery';
import { sortedDeduplicatedArray } from '@/logic/search';

type Args = {
  email: string;
  textQuery: string;
  tags: TagEnum[];
  decisionBodyIds: number[];
};
export const subscribeToSearch = async (
  db: Kysely<DB>,
  { email, textQuery, tags, decisionBodyIds }: Args,
) => {
  const subscriber = await getOrCreateSubscriber(db, email);
  await db
    .insertInto('Subscriptions')
    .values({
      subscriberId: subscriber.id,
      textQuery,
      tags: sortedDeduplicatedArray(tags),
      decisionBodyIds: sortedDeduplicatedArray(decisionBodyIds),
      tsQuery: sql<string>`to_tsquery(${queryAndTagsToPostgresTextSearchQuery({
        textQuery: textQuery,
        tags: tags as TagEnum[],
      })})`,
    })
    .onConflict((oc) => oc.doNothing())
    .execute();

  return subscriber;
};

type UnsubscribeArgs = {
  token: string;
  subscriptionId: number;
};
export const unsubscribeFromSearch = async (
  db: Kysely<DB>,
  { token, subscriptionId }: UnsubscribeArgs,
) => {
  const subscriber = await validateToken(db, token);

  if (subscriber) {
    await db
      .deleteFrom('Subscriptions')
      .where('Subscriptions.id', '=', subscriptionId)
      .where('Subscriptions.subscriberId', '=', subscriber.id)
      .executeTakeFirstOrThrow();
  }
};

export const getSubscriptionsByToken = async (
  db: Kysely<DB>,
  token: string,
) => {
  const subscriber = await validateToken(db, token);

  if (!subscriber) {
    return subscriber;
  }

  const subscriptions = await db
    .selectFrom('Subscriptions')
    .select([
      'Subscriptions.id',
      'Subscriptions.textQuery',
      'Subscriptions.tags',
      'Subscriptions.decisionBodyIds',
    ])
    .where('Subscriptions.subscriberId', '=', subscriber.id)
    .execute();

  return {
    subscriber,
    subscriptions: subscriptions.map(({ tags, ...rest }) => ({
      ...rest,
      tags: tags as TagEnum[],
    })),
  };
};

export const validateToken = async (db: Kysely<DB>, token: string) => {
  return await db
    .selectFrom('Subscribers')
    .select(['id', 'email', 'unsubscribeToken'])
    .where('unsubscribeToken', '=', token)
    .executeTakeFirst();
};

export const getOrCreateSubscriber = async (db: Kysely<DB>, email: string) => {
  return await db
    .with('new', (db) =>
      db
        .insertInto('Subscribers')
        .onConflict((oc) => oc.column('email').doNothing())
        .values({ email })
        .returning(['id', 'unsubscribeToken']),
    )
    .selectFrom('new')
    .union(
      db
        .selectFrom('Subscribers')
        .where('email', '=', email)
        .select(['id', 'unsubscribeToken']),
    )
    .selectAll()
    .executeTakeFirstOrThrow();
};

export const refreshAllSubscriptionQueries = async (db: Kysely<DB>) => {
  await db.transaction().execute(async (db) => {
    const subscriptionData = await db
      .selectFrom('Subscriptions')
      .forUpdate()
      .select(['id', 'subscriberId', 'tags', 'textQuery'])
      .execute();

    if (subscriptionData.length === 0) return;

    const insertValues = subscriptionData.map((values) => ({
      ...values,
      tsQuery: sql<string>`to_tsquery(${queryAndTagsToPostgresTextSearchQuery({
        textQuery: values.textQuery,
        tags: values.tags as TagEnum[],
      })})`,
    }));

    // this felt like the easiest way to do a bulk update, but it is weird
    // we're doing it with an insert

    const result = await db
      .insertInto('Subscriptions')
      .onConflict((oc) =>
        oc
          .column('id')
          .doUpdateSet((eb) => ({ tsQuery: eb.ref('excluded.tsQuery') })),
      )
      .values(insertValues)
      .execute();

    console.log(`refreshed ${result.length} subscription queries`);
  });
};
