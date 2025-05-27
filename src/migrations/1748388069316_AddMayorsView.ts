import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
		CREATE MATERIALIZED VIEW "Mayors" AS
		SELECT DISTINCT
		  "contactSlug",
		  "term"
		FROM
			"RawContacts"
		WHERE "primaryRole" = 'Mayor'
	  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
	await sql`
    	DROP MATERIALIZED VIEW IF EXISTS "Mayors";
	`.execute(db)
}
