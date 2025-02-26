import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AgendaItem" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid (),
      "termId" INT NOT NULL,
      "agendaItemId" INT NOT NULL,
      "councilAgendaItemId" INT NOT NULL,
      "decisionBodyId" INT NOT NULL,
      "meetingId" INT NOT NULL,
      "itemProcessId" INT NOT NULL,
      "decisionBodyName" TEXT NOT NULL,
      "meetingDate" BIGINT NOT NULL,
      "reference" TEXT NOT NULL,
      "termYear" TEXT NOT NULL,
      "agendaCd" TEXT NOT NULL,
      "meetingNumber" TEXT NOT NULL,
      "itemStatus" TEXT NOT NULL,
      "agendaItemTitle" TEXT NOT NULL,
      "agendaItemSummary" TEXT NOT NULL,
      "agendaItemRecommendation" TEXT,
      "decisionRecommendations" TEXT,
      "decisionAdvice" TEXT,
      "subjectTerms" TEXT NOT NULL,
      "wardId" INT[],
      "backgroundAttachmentId" INT[],
      "agendaItemAddress" json,
      "address" TEXT[],
      "geoLocation" TEXT[],
      "planningApplicationNumber" TEXT,
      "neighbourhoodId" INT[],
      UNIQUE ("reference", "meetingId")
    );

    comment ON COLUMN "AgendaItem"."id" IS 'auto-generated pkey, prefer using reference and meetingId to distinguish agenda items';

    comment ON COLUMN "AgendaItem"."termId" IS 'TMMIS ID';

    comment ON COLUMN "AgendaItem"."agendaItemId" IS 'TMMIS ID';

    comment ON COLUMN "AgendaItem"."councilAgendaItemId" IS 'TMMIS ID';

    comment ON COLUMN "AgendaItem"."decisionBodyId" IS 'TMMIS ID';

    comment ON COLUMN "AgendaItem"."meetingId" IS 'TMMIS ID';

    comment ON COLUMN "AgendaItem"."itemProcessId" IS 'Unknown purpose';

    comment ON COLUMN "AgendaItem"."decisionBodyName" IS 'May be better to denormalize into a decision body table';

    comment ON COLUMN "AgendaItem"."meetingDate" IS 'Unix timestamp in millseconds';

    comment ON COLUMN "AgendaItem"."reference" IS 'Reference number, e.g. 2024.EX19.2';

    comment ON COLUMN "AgendaItem"."termYear" IS 'Year of term, first component of reference';

    comment ON COLUMN "AgendaItem"."agendaCd" IS 'Agenda committe descriptor, first half of second component of reference';

    comment ON COLUMN "AgendaItem"."meetingNumber" IS 'Which meeting in the current year, second half of second component of reference';

    comment ON COLUMN "AgendaItem"."itemStatus" IS 'An enumeration that we havent yet documented the full extend of';

    comment ON COLUMN "AgendaItem"."agendaItemTitle" IS 'Plain text content';

    comment ON COLUMN "AgendaItem"."agendaItemSummary" IS 'HTML content';

    comment ON COLUMN "AgendaItem"."agendaItemRecommendation" IS 'HTML content';

    comment ON COLUMN "AgendaItem"."decisionRecommendations" IS 'HTML content';

    comment ON COLUMN "AgendaItem"."decisionAdvice" IS 'HTML content';

    comment ON COLUMN "AgendaItem"."wardId" IS 'Array of TMMIS IDs';

    comment ON COLUMN "AgendaItem"."subjectTerms" IS 'Semi-colon/comma separated string';

    comment ON COLUMN "AgendaItem"."backgroundAttachmentId" IS 'Array of TMMIS IDs';

    comment ON COLUMN "AgendaItem"."agendaItemAddress" IS 'Array of address objects, see api/agendaItem.ts';

    comment ON COLUMN "AgendaItem"."address" IS 'Array of addresses as strings.';

    comment ON COLUMN "AgendaItem"."geoLocation" IS 'Array of lat/lon coordinates stored as strings.';

    comment ON COLUMN "AgendaItem"."planningApplicationNumber" IS 'Comma separated list of text reference numbers.';

    comment ON COLUMN "AgendaItem"."neighbourhoodId" IS 'Array of TMMIS IDs';
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE "AgendaItem";
  `.execute(db);
}
