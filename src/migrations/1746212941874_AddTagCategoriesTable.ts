import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE "TagCategories" ("category" TEXT NOT NULL, "tag" TEXT NOT NULL);

    CREATE UNIQUE INDEX "idx_category_tag" ON "TagCategories" ("category", "tag");
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "TagCategories";
  `.execute(db);
}
