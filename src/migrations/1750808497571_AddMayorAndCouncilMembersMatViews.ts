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
  await sql`
  CREATE MATERIALIZED VIEW "CouncilMembers" AS
  SELECT
    "contactSlug",
    "term",
    "wardSlug",
    "wardName",
    "wardId"
  FROM
    "Councillors"
    INNER JOIN "Wards" USING ("wardSlug")
  UNION ALL
  SELECT
    "contactSlug",
    "term",
    NULL AS "wardSlug",
    NULL AS "wardName",
    NULL AS "wardId"
  FROM
    "Mayors"
`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
     DROP MATERIALIZED VIEW IF EXISTS "Mayors";
   `.execute(db);
  await sql`
    DROP MATERIALIZED VIEW IF EXISTS "CouncilMembers";
  `.execute(db);
}
