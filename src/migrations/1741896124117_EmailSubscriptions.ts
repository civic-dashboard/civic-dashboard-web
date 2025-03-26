import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE "RawAgendaItemConsiderations"
    ADD COLUMN "notificationSent" BOOLEAN NOT NULL DEFAULT TRUE;

    ALTER TABLE "RawAgendaItemConsiderations"
    ALTER COLUMN "notificationSent"
    SET DEFAULT FALSE;

    CREATE INDEX "NotificationsIndex" ON "RawAgendaItemConsiderations" ("notificationSent");

    COMMENT ON COLUMN "RawAgendaItemConsiderations"."notificationSent" IS 'whether a notification has been sent to subscribers for this column.';

    CREATE TABLE "Subscribers" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) UNIQUE NOT NULL,
      "unsubscribeToken" VARCHAR(255) NOT NULL DEFAULT md5(random()::TEXT)
    );

    COMMENT ON COLUMN "Subscribers"."id" IS 'auto-generated pkey';

    COMMENT ON COLUMN "Subscribers"."email" IS 'subscriber email address';

    CREATE TABLE "Subscriptions" (
      "id" serial PRIMARY KEY,
      "subscriberId" INT NOT NULL REFERENCES "Subscribers" ("id") ON DELETE CASCADE,
      "textQuery" TEXT NOT NULL DEFAULT '',
      "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "decisionBodyIds" INT[] NOT NULL DEFAULT ARRAY[]::INT[],
      "tsQuery" tsquery,
      UNIQUE (
        "subscriberId",
        "textQuery",
        "tags",
        "decisionBodyIds"
      )
    );

    CREATE INDEX "SubscriptionsSubscriberIndex" ON "Subscriptions" ("subscriberId");

    COMMENT ON COLUMN "Subscriptions"."id" IS 'auto-generated pkey';

    COMMENT ON COLUMN "Subscriptions"."subscriberId" IS 'foreign key to Subscribers';

    COMMENT ON COLUMN "Subscriptions"."textQuery" IS 'text query';

    COMMENT ON COLUMN "Subscriptions"."tags" IS 'array of tags';

    COMMENT ON COLUMN "Subscriptions"."decisionBodyIds" IS 'array of decision bodies';

    COMMENT ON COLUMN "Subscriptions"."tsQuery" IS 'pre-computed search query';
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE "RawAgendaItemConsiderations"
    DROP COLUMN IF EXISTS "notificationSent";

    DROP TABLE IF EXISTS "Subscriptions";

    DROP TABLE IF EXISTS "Subscribers";
  `.execute(db);
}
