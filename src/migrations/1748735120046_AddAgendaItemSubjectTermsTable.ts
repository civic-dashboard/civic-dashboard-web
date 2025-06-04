import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AgendaItemSubjectTerms" (
      "agendaItemId" INTEGER NOT NULL,
      "subjectTermRaw" TEXT NOT NULL,
      "subjectTermNormalized" TEXT NOT NULL,
      "subjectTermSlug" TEXT NOT NULL
    );

    CREATE UNIQUE INDEX "idx_agenda_item_subject_terms" ON "AgendaItemSubjectTerms" ("agendaItemId", "subjectTermSlug");
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "AgendaItemSubjectTerms";
  `.execute(db);
}
