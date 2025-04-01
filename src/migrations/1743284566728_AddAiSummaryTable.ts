import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AiSummaries" (
      "agendaItemNumber" TEXT NOT NULL,
      "summary" TEXT NOT NULL
    );
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('AiSummaries').ifExists().execute();
}
