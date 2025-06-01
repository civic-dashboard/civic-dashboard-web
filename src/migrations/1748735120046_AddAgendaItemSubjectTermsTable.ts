import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AgendaItemSubjectTerms" (
      "reference" TEXT NOT NULL,
      "meetingId" INTEGER NOT NULL,
      "agendaItemId" INTEGER NOT NULL,
      "subjectTermRaw" TEXT NOT NULL,
      "subjectTermNormalized" TEXT NOT NULL,
      "subjectTermSlug" TEXT NOT NULL,
      PRIMARY KEY ("agendaItemId", "subjectTermSlug"),
      CONSTRAINT fk_agenda_item FOREIGN KEY ("reference", "meetingId") REFERENCES "RawAgendaItemConsiderations" ("reference", "meetingId") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "AgendaItemSubjectTerms";
  `.execute(db);
}
