import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "TagCategories";

    CREATE TABLE "TagCategories" (
      "category" TEXT NOT NULL,
      "tagRaw" TEXT NOT NULL,
      "tagNormalized" TEXT NOT NULL,
      "tagSlug" TEXT NOT NULL
    );

    CREATE UNIQUE INDEX "idx_category_tag" ON "TagCategories" ("category", "tagSlug");
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP TABLE IF EXISTS "TagCategories";
  `.execute(db);
}
