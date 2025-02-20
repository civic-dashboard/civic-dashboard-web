import { repopulateRawContactsAndVotes } from '@/database/pipelines/repopulateRawContactsAndVotes';
import { NextRequest } from 'next/server';

async function updateCouncillorData() {
  await repopulateRawContactsAndVotes();
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET)
    return Response.json({ error: 'unauthorized', updateApplied: false });

  await updateCouncillorData();
  return Response.json({ updateApplied: true });
}
