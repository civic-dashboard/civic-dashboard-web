import { sendEmail } from '@/logic/email';
import { TaggedAgendaItem } from '@/logic/search';

export async function POST(request: Request) {
  const body = (await request.json()) as TaggedAgendaItem[];
  await sendEmail(body);

  return Response.json({ success: true });
}
