import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AgendaItemCategories" (
      "agendaItemId" INT NOT NULL,
      "category" TEXT NOT NULL
    );

    CREATE UNIQUE INDEX "idx_agendaItemId_category" ON "AgendaItemCategories" ("agendaItemId", "category");
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "AgendaItemCategories";
  `.execute(db);
}
