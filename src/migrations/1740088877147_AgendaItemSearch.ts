import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
   ALTER TABLE "RawAgendaItemConsiderations"
   ADD COLUMN "textSearchVector" tsvector generated always AS (
     setweight(
       to_tsvector('english', COALESCE("agendaItemTitle", '')),
       'A'
     ) || setweight(
       to_tsvector('english', COALESCE("decisionBodyName", '')) || to_tsvector('english', COALESCE("subjectTerms", '')) || to_tsvector('english', COALESCE("reference", '')),
       'B'
     ) || setweight(
       to_tsvector('english', COALESCE("agendaItemSummary", '')),
       'C'
     ) || setweight(
       to_tsvector(
         'english',
         COALESCE("agendaItemRecommendation", '')
       ) || to_tsvector(
         'english',
         COALESCE("decisionRecommendations", '')
       ) || to_tsvector('english', COALESCE("decisionAdvice", '')),
       'D'
     )
   ) stored;

   COMMENT ON COLUMN "RawAgendaItemConsiderations"."textSearchVector" IS 'Auto-generated lexemes to be indexed for text search mathing/relevance ranking.';

   CREATE INDEX "AgendaItemTextSearchIndex" ON "RawAgendaItemConsiderations" USING gin ("textSearchVector");
 `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP INDEX "AgendaItemTextSearchIndex";

    ALTER TABLE "RawAgendaItemConsiderations"
    DROP COLUMN "textSearchVector";
  `.execute(db);
}
