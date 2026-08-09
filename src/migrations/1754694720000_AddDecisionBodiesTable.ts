import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "DecisionBodies" (
      "decisionBodyId" INT PRIMARY KEY,
      "committeeCodeId" INT NOT NULL,
      "termId" INT NOT NULL,
      "decisionBodyName" TEXT NOT NULL,
      "email" TEXT,
      "duties" TEXT,
      "dbdyStatusCd" TEXT NOT NULL,
      "phoneAreaCode" TEXT,
      "phoneNumber" TEXT,
      "faxAreaCode" TEXT,
      "faxNumber" TEXT,
      "webpostInd" TEXT NOT NULL,
      "contactFirstName" TEXT,
      "contactLastName" TEXT,
      "generalAddress" TEXT,
      "decisionBodyPublishLabelCd" TEXT NOT NULL,
      "committeeCode" TEXT NOT NULL,
      "tier" INT NOT NULL,
      "termType" TEXT NOT NULL,
      "trmStartDate" BIGINT NOT NULL,
      "trmEndDate" BIGINT NOT NULL,
      "members" JSONB NOT NULL
    );

    CREATE INDEX "idx_decision_bodies_term_id" ON "DecisionBodies" ("termId");

    COMMENT ON COLUMN "DecisionBodies"."decisionBodyId" IS 'TMMIS decision body ID';

    COMMENT ON COLUMN "DecisionBodies"."termId" IS 'TMMIS council term ID';

    COMMENT ON COLUMN "DecisionBodies"."committeeCode" IS 'Flattened from TMMIS committeeCode.committeeCode';

    COMMENT ON COLUMN "DecisionBodies"."tier" IS 'Flattened from TMMIS decisionBodyType.tier';

    COMMENT ON COLUMN "DecisionBodies"."termType" IS 'Flattened from TMMIS term.termType';

    COMMENT ON COLUMN "DecisionBodies"."trmStartDate" IS 'Unix timestamp in milliseconds';

    COMMENT ON COLUMN "DecisionBodies"."trmEndDate" IS 'Unix timestamp in milliseconds';

    COMMENT ON COLUMN "DecisionBodies"."members" IS 'JSONB array of member objects from TMMIS';
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "DecisionBodies";
  `.execute(db);
}
