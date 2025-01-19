import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createView('Contacts')
    .as(
      db
        .selectFrom((eb) =>
          eb
            .selectFrom('RawContacts')
            .selectAll()
            .orderBy('term', 'desc')
            .as('OrderedContacts'),
        )
        .distinctOn('contactSlug')
        .select(['contactName', 'contactSlug', 'photoUrl', 'email', 'phone']),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('Councillors')
    .as(
      db
        .selectFrom('RawContacts')
        .distinctOn(['term', 'wardSlug'])
        .select(['contactSlug', 'wardSlug', 'term'])
        .where('primaryRole', '=', 'Councillor')
        .whereRef('term', '=', (eb) =>
          eb
            .selectFrom('RawContacts')
            .select([(qb) => qb.fn.max('term').as('maxTerm')]),
        )
        .orderBy('term', 'desc'),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('Wards')
    .as(
      db
        .selectFrom('RawContacts')
        .distinct()
        .select(['wardSlug', 'wardName', 'wardId'])
        .where('wardId', 'is not', null),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('Committees')
    .as(
      db
        .selectFrom('RawVotes')
        .distinct()
        .select(['committeeSlug', 'committeeName']),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('AgendaItems')
    .as(
      db
        .selectFrom('RawVotes')
        .distinct()
        .select([
          'agendaItemNumber',
          'agendaItemTitle',
          'movedBy',
          'secondedBy',
        ]),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('ProblemAgendaItems')
    .as(
      db
        .selectFrom('RawVotes')
        .select([
          'agendaItemNumber',
          sql`COUNT(distinct "result")`.as('resultCount'),
        ])
        .groupBy([
          'agendaItemNumber',
          'motionType',
          'voteDescription',
          'dateTime',
        ])
        .having(sql`COUNT (distinct "result")`, '>', 1),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('Motions')
    .as(
      db
        .selectFrom('RawVotes')
        .distinct()
        .select([
          'agendaItemNumber',
          'motionId',
          'motionType',
          'voteDescription',
          'dateTime',
          'committeeSlug',
          'result',
          sql`split_part("result", ', ', 1)`.as('resultKind'),
          sql`split_part(split_part("result", ', ', 2), '-', 1)::int`.as(
            'yesVotes',
          ),
          sql`split_part(split_part("result", ', ', 2), '-', 2)::int`.as(
            'noVotes',
          ),
        ])
        .whereRef('agendaItemNumber', 'not in', (eb) =>
          eb.selectFrom('ProblemAgendaItems').select('agendaItemNumber'),
        ),
    )
    .materialized()
    .execute();

  await db.schema
    .createView('Votes')
    .as(
      db
        .selectFrom('RawVotes')
        .distinct()
        .select([
          'agendaItemNumber',
          'motionId',
          'contactSlug',
          'vote as value',
        ])
        .whereRef('agendaItemNumber', 'not in', (qb) =>
          qb.selectFrom('ProblemAgendaItems').select('agendaItemNumber'),
        ),
    )

    .materialized()
    .execute();
}
