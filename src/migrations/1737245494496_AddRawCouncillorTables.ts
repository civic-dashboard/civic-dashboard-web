import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('RawVotes')
    .addColumn('term', 'text', (col) => col.notNull())
    .addColumn('committeeName', 'text', (col) => col.notNull())
    .addColumn('committeeSlug', 'text', (col) => col.notNull())
    .addColumn('dateTime', 'text', (col) => col.notNull())
    .addColumn('agendaItemNumber', 'text', (col) => col.notNull())
    .addColumn('agendaItemTitle', 'text', (col) => col.notNull())
    .addColumn('motionId', 'text', (col) => col.notNull())
    .addColumn('motionType', 'text', (col) => col.notNull())
    .addColumn('vote', 'text', (col) => col.notNull())
    .addColumn('result', 'text', (col) => col.notNull())
    .addColumn('voteDescription', 'text', (col) => col.notNull())
    .addColumn('inputRowNumber', 'bigint', (col) => col.notNull())
    .addColumn('contactName', 'text', (col) => col.notNull())
    .addColumn('contactSlug', 'text', (col) => col.notNull())
    .addColumn('movedBy', 'text')
    .addColumn('secondedBy', sql`text[]`)
    .execute();

  await db.schema
    .createTable('RawContacts')
    .addColumn('primaryRole', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('photoUrl', 'text')
    .addColumn('website', 'text')
    .addColumn('addressLine1', 'text')
    .addColumn('addressLine2', 'text')
    .addColumn('locality', 'text')
    .addColumn('postalCode', 'text')
    .addColumn('province', 'text')
    .addColumn('phone', 'text')
    .addColumn('fax', 'text')
    .addColumn('personalWebsite', 'text')
    .addColumn('term', 'text', (col) => col.notNull())
    .addColumn('inputRowNumber', 'bigint', (col) => col.notNull())
    .addColumn('wardId', 'text')
    .addColumn('wardName', 'text')
    .addColumn('wardSlug', 'text')
    .addColumn('contactName', 'text', (col) => col.notNull())
    .addColumn('contactSlug', 'text', (col) => col.notNull())
    .execute();
}
