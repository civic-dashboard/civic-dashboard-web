import { repopulateRawAgendaItems } from '@/database/pipelines/repopulateRawAgendaItems';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET)
    return Response.json({ error: 'unauthorized', updateApplied: false });

  await repopulateRawAgendaItems();
  return Response.json({ updateApplied: true });
}
