import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE MATERIALIZED VIEW "AgendaItemsCategories" AS
    SELECT DISTINCT
      t1."agendaItemId",
      t2."category"
    FROM
      "RawAgendaItemConsiderations" t1
      JOIN "TagCategories" t2 ON t2."tag" = ANY (STRING_TO_ARRAY(t1."subjectTerms", ','))
    ORDER BY
      t1."agendaItemId",
      t2."category";

    CREATE UNIQUE INDEX ON "AgendaItemsCategories" ("agendaItemId", "category");
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP MATERIALIZED VIEW IF EXISTS "AgendaItemsCategories" CASCADE;
  `.execute(db);
}
