import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "RawAgendaItemConsiderations" (
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
      "agendaItemAddress" JSON,
      "address" TEXT[],
      "geoLocation" TEXT[],
      "planningApplicationNumber" TEXT,
      "neighbourhoodId" INT[],
      UNIQUE ("reference", "meetingId")
    );

    comment ON COLUMN "RawAgendaItemConsiderations"."id" IS 'auto-generated pkey, prefer using reference and meetingId to distinguish agenda items';

    comment ON COLUMN "RawAgendaItemConsiderations"."termId" IS 'TMMIS ID';

    comment ON COLUMN "RawAgendaItemConsiderations"."agendaItemId" IS 'TMMIS ID';

    comment ON COLUMN "RawAgendaItemConsiderations"."councilAgendaItemId" IS 'TMMIS ID';

    comment ON COLUMN "RawAgendaItemConsiderations"."decisionBodyId" IS 'TMMIS ID';

    comment ON COLUMN "RawAgendaItemConsiderations"."meetingId" IS 'TMMIS ID';

    comment ON COLUMN "RawAgendaItemConsiderations"."itemProcessId" IS 'Unknown purpose';

    comment ON COLUMN "RawAgendaItemConsiderations"."decisionBodyName" IS 'May be better to denormalize into a decision body table';

    comment ON COLUMN "RawAgendaItemConsiderations"."meetingDate" IS 'Unix timestamp in millseconds';

    comment ON COLUMN "RawAgendaItemConsiderations"."reference" IS 'Reference number, e.g. 2024.EX19.2';

    comment ON COLUMN "RawAgendaItemConsiderations"."termYear" IS 'Year of term, first component of reference';

    comment ON COLUMN "RawAgendaItemConsiderations"."agendaCd" IS 'Agenda committe descriptor, first half of second component of reference';

    comment ON COLUMN "RawAgendaItemConsiderations"."meetingNumber" IS 'Which meeting in the current year, second half of second component of reference';

    comment ON COLUMN "RawAgendaItemConsiderations"."itemStatus" IS 'An enumeration that we havent yet documented the full extend of';

    comment ON COLUMN "RawAgendaItemConsiderations"."agendaItemTitle" IS 'Plain text content';

    comment ON COLUMN "RawAgendaItemConsiderations"."agendaItemSummary" IS 'HTML content';

    comment ON COLUMN "RawAgendaItemConsiderations"."agendaItemRecommendation" IS 'HTML content';

    comment ON COLUMN "RawAgendaItemConsiderations"."decisionRecommendations" IS 'HTML content';

    comment ON COLUMN "RawAgendaItemConsiderations"."decisionAdvice" IS 'HTML content';

    comment ON COLUMN "RawAgendaItemConsiderations"."wardId" IS 'Array of TMMIS IDs';

    comment ON COLUMN "RawAgendaItemConsiderations"."subjectTerms" IS 'Semi-colon/comma separated string';

    comment ON COLUMN "RawAgendaItemConsiderations"."backgroundAttachmentId" IS 'Array of TMMIS IDs';

    comment ON COLUMN "RawAgendaItemConsiderations"."agendaItemAddress" IS 'Array of address objects, see api/agendaItem.ts';

    comment ON COLUMN "RawAgendaItemConsiderations"."address" IS 'Array of addresses as strings.';

    comment ON COLUMN "RawAgendaItemConsiderations"."geoLocation" IS 'Array of lat/lon coordinates stored as strings.';

    comment ON COLUMN "RawAgendaItemConsiderations"."planningApplicationNumber" IS 'Comma separated list of text reference numbers.';

    comment ON COLUMN "RawAgendaItemConsiderations"."neighbourhoodId" IS 'Array of TMMIS IDs';
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE "RawAgendaItemConsiderations";
  `.execute(db);
}
