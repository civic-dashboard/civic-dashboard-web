import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AiSummaries" (
      "agendaItemNumber" TEXT PRIMARY KEY,
      "summary" TEXT NOT NULL
    );
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('AiSummaries').ifExists().execute();
}
