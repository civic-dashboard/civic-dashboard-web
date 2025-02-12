import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "RawContacts" (
      "primaryRole" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "photoUrl" TEXT NULL,
      "website" TEXT NULL,
      "addressLine1" TEXT NULL,
      "addressLine2" TEXT NULL,
      "locality" TEXT NULL,
      "postalCode" TEXT NULL,
      "province" TEXT NULL,
      "phone" TEXT NULL,
      "fax" TEXT NULL,
      "personalWebsite" TEXT NULL,
      "term" TEXT NOT NULL,
      "inputRowNumber" BIGINT NOT NULL,
      "wardId" TEXT NULL,
      "wardName" TEXT NULL,
      "wardSlug" TEXT NULL,
      "contactName" TEXT NOT NULL,
      "contactSlug" TEXT NOT NULL
    );
  `.execute(db);
  await sql`
    CREATE TABLE "RawVotes" (
      "term" TEXT NOT NULL,
      "committeeName" TEXT NOT NULL,
      "committeeSlug" TEXT NOT NULL,
      "dateTime" TEXT NOT NULL,
      "agendaItemNumber" TEXT NOT NULL,
      "agendaItemTitle" TEXT NOT NULL,
      "motionId" TEXT NOT NULL,
      "motionType" TEXT NOT NULL,
      "vote" TEXT NOT NULL,
      "result" TEXT NOT NULL,
      "voteDescription" TEXT NOT NULL,
      "inputRowNumber" BIGINT NOT NULL,
      "contactName" TEXT NOT NULL,
      "contactSlug" TEXT NOT NULL,
      "movedBy" TEXT NULL,
      "secondedBy" TEXT[] NULL
    );
  `.execute(db);
}
