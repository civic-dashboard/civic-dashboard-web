import { getDB } from '@/database/kyselyDb';
import { sql } from 'kysely';
import { NextRequest } from 'next/server';

async function updateCouncillorData() {
  // Todo: Fetch and insert new data to raw tables
  await sql`
    REFRESH MATERIALIZED VIEW "Contacts";
    REFRESH MATERIALIZED VIEW "Councillors";
    REFRESH MATERIALIZED VIEW "Wards";
    REFRESH MATERIALIZED VIEW "Committees";
    REFRESH MATERIALIZED VIEW "AgendaItems";
    REFRESH MATERIALIZED VIEW "ProblemAgendaItems";
    REFRESH MATERIALIZED VIEW "Motions";
    REFRESH MATERIALIZED VIEW "Votes";
  `.execute(getDB());
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET)
    return Response.json({ error: 'unauthorized', updateApplied: false });

  await updateCouncillorData();
  return Response.json({ updateApplied: true });
}
