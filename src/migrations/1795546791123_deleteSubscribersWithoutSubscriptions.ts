import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    DELETE FROM "Subscribers" AS s
    WHERE
      NOT EXISTS (
        SELECT
          1
        FROM
          "Subscriptions" AS sub
        WHERE
          sub."subscriberId" = s."id"
      );
  `.execute(db);
}

export async function down(_db: Kysely<unknown>): Promise<void> {
  // The cleanup is irreversible because deleted subscriber records are not retained.
}
