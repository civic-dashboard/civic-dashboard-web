import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "DecisionBodies" (
      "decisionBodyId" INT PRIMARY KEY,
      "termId" INT NOT NULL,
      "decisionBodyName" TEXT NOT NULL,
      "email" TEXT,
      "decisionBodyPublishLabelCd" TEXT NOT NULL,
      "payload" JSONB NOT NULL,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX "DecisionBodies_termId_idx" ON "DecisionBodies" ("termId");

    COMMENT ON COLUMN "DecisionBodies"."decisionBodyId" IS 'TMMIS decision body ID';

    COMMENT ON COLUMN "DecisionBodies"."termId" IS 'TMMIS council term ID';

    COMMENT ON COLUMN "DecisionBodies"."payload" IS 'Full DecisionBody JSON from TMMIS';
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "DecisionBodies";
  `.execute(db);
}
