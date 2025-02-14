import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE MATERIALIZED VIEW "Contacts" AS
    SELECT DISTINCT
      ON ("contactSlug") "contactName",
      "contactSlug",
      "photoUrl",
      "email",
      "phone"
    FROM
      (
        SELECT
          *
        FROM
          "RawContacts"
        ORDER BY
          "term" DESC
      ) AS raw
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Councillors" AS
    SELECT DISTINCT
      ON ("term", "wardSlug") "contactSlug",
      "wardSlug",
      "term"
    FROM
      "RawContacts"
    WHERE
      "primaryRole" = 'Councillor'
      AND "term" = (
        SELECT
          max("term")
        FROM
          "RawContacts"
      )
    ORDER BY
      "term" DESC
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Wards" AS
    SELECT DISTINCT
      "wardSlug",
      "wardName",
      "wardId"
    FROM
      "RawContacts"
    WHERE
      "wardId" IS NOT NULL
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Committees" AS
    SELECT DISTINCT
      "committeeSlug",
      "committeeName"
    FROM
      "RawVotes"
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "AgendaItems" AS
    SELECT DISTINCT
      "agendaItemNumber",
      "agendaItemTitle",
      "movedBy",
      "secondedBy"
    FROM
      "RawVotes"
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "ProblemAgendaItems" AS
    SELECT
      "agendaItemNumber",
      COUNT(DISTINCT "result")
    FROM
      "RawVotes"
    GROUP BY
      (
        "agendaItemNumber",
        "motionType",
        "voteDescription",
        "dateTime"
      )
    HAVING
      COUNT(DISTINCT "result") > 1
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Motions" AS
    SELECT DISTINCT
      "agendaItemNumber",
      "motionId",
      "motionType",
      "voteDescription",
      "dateTime",
      "committeeSlug",
      "result",
      split_part("result", ', ', 1) AS "resultKind",
      split_part(split_part("result", ', ', 2), '-', 1)::INT AS "yesVotes",
      split_part(split_part("result", ', ', 2), '-', 2)::INT AS "noVotes"
    FROM
      "RawVotes"
    WHERE
      "agendaItemNumber" NOT IN (
        SELECT
          "agendaItemNumber"
        FROM
          "ProblemAgendaItems"
      )
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Votes" AS
    SELECT DISTINCT
      "agendaItemNumber",
      "motionId",
      "contactSlug",
      "vote" AS "value"
    FROM
      "RawVotes"
    WHERE
      "agendaItemNumber" NOT IN (
        SELECT
          "agendaItemNumber"
        FROM
          "ProblemAgendaItems"
      )
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Movers" AS
    SELECT DISTINCT
      ON ("agendaItemNumber") "agendaItemNumber",
      "movedBy"
    FROM
      "RawVotes"
    WHERE
      "movedBy" IS NOT NULL
  `.execute(db);
  await sql`
    CREATE MATERIALIZED VIEW "Seconders" AS
    SELECT
      "agendaItemNumber",
      unnest("secondedBy")
    FROM
      (
        SELECT DISTINCT
          ON ("agendaItemNumber") "agendaItemNumber",
          "secondedBy"
        FROM
          "RawVotes"
        WHERE
          "secondedBy" IS NOT NULL
      ) AS raw
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    DROP MATERIALIZED VIEW IF EXISTS "Seconders";

    DROP MATERIALIZED VIEW IF EXISTS "Movers";

    DROP MATERIALIZED VIEW IF EXISTS "Votes";

    DROP MATERIALIZED VIEW IF EXISTS "Motions";

    DROP MATERIALIZED VIEW IF EXISTS "ProblemAgendaItems";

    DROP MATERIALIZED VIEW IF EXISTS "AgendaItems";

    DROP MATERIALIZED VIEW IF EXISTS "Committees";

    DROP MATERIALIZED VIEW IF EXISTS "Wards";

    DROP MATERIALIZED VIEW IF EXISTS "Councillors";

    DROP MATERIALIZED VIEW IF EXISTS "Contacts";
  `.execute(db);
}
