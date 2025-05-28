import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
  CREATE MATERIALIZED VIEW "Mayors" AS
  SELECT DISTINCT
    "contactSlug",
    "term"
  FROM
    "RawContacts"
  WHERE
    "primaryRole" = 'Mayor'
    AND "term" = (
      SELECT
        max("term")
      FROM
        "RawContacts"
    );
`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
     DROP MATERIALIZED VIEW IF EXISTS "Mayors";
   `.execute(db);
}
