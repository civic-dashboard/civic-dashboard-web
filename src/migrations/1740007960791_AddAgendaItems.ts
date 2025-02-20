import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "AgendaItem" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid (), -- String identifier, can be UUID or similar
      "termId" INT NOT NULL, -- TMMIS ID
      "agendaItemId" INT NOT NULL, -- TMMIS ID
      "councilAgendaItemId" INT NOT NULL, -- TMMIS ID
      "decisionBodyId" INT NOT NULL, -- TMMIS ID
      "meetingId" INT NOT NULL, -- TMMIS ID
      "itemProcessId" INT NOT NULL, -- ???
      "decisionBodyName" TEXT NOT NULL, -- Probably can be denormalized into decision body table.
      "meetingDate" BIGINT NOT NULL,
      "reference" TEXT NOT NULL,
      "termYear" TEXT NOT NULL,
      "agendaCd" TEXT NOT NULL,
      "meetingNumber" TEXT NOT NULL,
      "itemStatus" TEXT NOT NULL,
      "agendaItemTitle" TEXT NOT NULL,
      "agendaItemSummary" TEXT NOT NULL, -- Agenda item summary (HTML content)
      "agendaItemRecommendation" TEXT, -- Agenda item recommendation (HTML content)
      "decisionRecommendations" TEXT, -- Decision recommendations (HTML content)
      "decisionAdvice" TEXT, -- Decision advice (HTML content)
      "subjectTerms" TEXT NOT NULL,
      "wardId" json, -- Array of ward IDs
      "backgroundAttachmentId" json, -- Array of background attachment IDs
      "agendaItemAddress" json, -- Array of addresses (presumably an Address object)
      "address" json, -- Array of addresses as strings
      "geoLocation" json, -- Array of geo-location coordinates (lat, lon)
      "planningApplicationNumber" TEXT, -- Planning application number
      "neighbourhoodId" json, -- Array of neighbourhood IDs
      UNIQUE ("reference", "meetingId") -- The same agenda item reference can appear multiple times, but only once per meeting.
    );
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE "AgendaItem";
  `.execute(db);
}
