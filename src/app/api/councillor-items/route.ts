import { parseNumberParam } from '@/api/utils';
import { NextRequest } from 'next/server';
import { getCouncillorItemsPaginated } from '@/logic/councillorItems';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseNumberParam(searchParams, 'page') ?? 1;

  if (Number.isNaN(page) || page < 0) {
    return Response.json({ error: `Invalid page: ${page} ` }, { status: 422 });
  }
  const pageSize = parseNumberParam(searchParams, 'pageSize') ?? 10;
  if (Number.isNaN(pageSize) || pageSize < 1) {
    return Response.json(
      { error: `Invalid page size: ${pageSize}` },
      { status: 422 },
    );
  }

  const contactSlug = searchParams.get('contactSlug');
  if (!contactSlug) {
    return Response.json(
      { error: `Invalid contact slug in request: ${request}` },
      { status: 422 },
    );
  }
  const [agendaItems, itemCount] = await getCouncillorItemsPaginated(
    contactSlug,
    page,
    pageSize,
  );
  const res = Response.json(agendaItems);
  res.headers.set('agenda-item-count', itemCount.toString());

  return res;
}
