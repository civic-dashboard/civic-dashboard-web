import { parseNumberParam } from '@/api/utils';
import { createDB } from '@/database/kyselyDb';
import { Kysely, sql } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { NextRequest } from 'next/server';
import { AgendaItem } from '@/app/councillors/[contactSlug]/types/index';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseNumberParam(searchParams, 'page') ?? 0;
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
  const db = createDB();
  let agendaItemsResult: AgendaItem[];
  let itemCount: { itemCount: number }[];
  try {
    agendaItemsResult = await getVotesByAgendaItemsForContact(
      db,
      contactSlug,
      page,
      pageSize,
    );
    itemCount = await getTotalAgendaItemsForContact(db, contactSlug);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
  const res = Response.json(agendaItemsResult);
  res.headers.set('agenda-item-count', itemCount[0].itemCount.toString());

  return res;
}

async function getTotalAgendaItemsForContact(
  db: Kysely<DB>,
  contactSlug: string,
): Promise<{ itemCount: number }[]> {
  const agendaItemCount = db
    .selectFrom('Votes')
    .innerJoin('Motions', (eb) =>
      eb
        .onRef('Votes.agendaItemNumber', '=', 'Motions.agendaItemNumber')
        .onRef('Votes.motionId', '=', 'Motions.motionId'),
    )
    .innerJoin('AgendaItems', (eb) =>
      eb.onRef('Votes.agendaItemNumber', '=', 'AgendaItems.agendaItemNumber'),
    )
    .select((eb) => [
      eb.fn
        .count<number>('AgendaItems.agendaItemNumber')
        .filterWhere('Votes.contactSlug', '=', contactSlug)
        .distinct()
        .as('itemCount'),
    ])
    .execute();
  return agendaItemCount;
}

async function getVotesByAgendaItemsForContact(
  db: Kysely<DB>,
  contactSlug: string,
  page: number,
  pageSize: number,
): Promise<AgendaItem[]> {
  const agendaItemsLimited = db
    .selectFrom((eb) =>
      eb
        .selectFrom('Votes')
        .innerJoin('Motions', (eb) =>
          eb
            .onRef('Votes.agendaItemNumber', '=', 'Motions.agendaItemNumber')
            .onRef('Votes.motionId', '=', 'Motions.motionId'),
        )
        .innerJoin('AgendaItems', (eb) =>
          eb.onRef(
            'Votes.agendaItemNumber',
            '=',
            'AgendaItems.agendaItemNumber',
          ),
        )
        .select(['Votes.agendaItemNumber', 'Motions.dateTime'])
        .where('Votes.contactSlug', '=', contactSlug)
        .distinctOn('AgendaItems.agendaItemNumber')
        .as('votesFiltered'),
    )
    .selectAll()
    .orderBy('dateTime desc')
    .offset((page - 1) * pageSize)
    .limit(pageSize)
    .as('agendaItemsLimited');

  const rows = await db
    .with('OriginalSummaries', (eb) =>
      eb
        .selectFrom('RawAgendaItemConsiderations')
        .select(['reference', 'agendaItemSummary'])
        .distinct(),
    )
    .with('AutoSummaries', (eb) =>
      eb
        .selectFrom('AiSummaries')
        .groupBy('AiSummaries.agendaItemNumber')
        .having(sql<number>`count(*)`, '=', 1)
        .select([
          'AiSummaries.agendaItemNumber',
          sql<string>`MIN("summary")`.as('aiSummary'),
        ]),
    )
    .with('AgendaItemsToUse', (eb) =>
      eb
        .selectFrom(agendaItemsLimited)
        .select(['agendaItemsLimited.agendaItemNumber']),
    )
    .selectFrom('Votes')
    .innerJoin('Motions', (eb) =>
      eb
        .onRef('Votes.agendaItemNumber', '=', 'Motions.agendaItemNumber')
        .onRef('Votes.motionId', '=', 'Motions.motionId'),
    )
    .innerJoin('AgendaItems', (eb) =>
      eb.onRef('Votes.agendaItemNumber', '=', 'AgendaItems.agendaItemNumber'),
    )
    .innerJoin('Committees', (eb) =>
      eb.onRef('Committees.committeeSlug', '=', 'Motions.committeeSlug'),
    )
    .leftJoin('OriginalSummaries', (eb) =>
      eb.onRef(
        'AgendaItems.agendaItemNumber',
        '=',
        'OriginalSummaries.reference',
      ),
    )
    .leftJoin('AutoSummaries', (eb) =>
      eb.onRef(
        'AgendaItems.agendaItemNumber',
        '=',
        'AutoSummaries.agendaItemNumber',
      ),
    )
    .where('Votes.contactSlug', '=', contactSlug)
    .where('Votes.agendaItemNumber', 'in', (eb) =>
      eb
        .selectFrom('AgendaItemsToUse')
        .select('AgendaItemsToUse.agendaItemNumber'),
    )
    .orderBy('Motions.dateTime', 'desc')
    .select([
      'AgendaItems.agendaItemNumber',
      'AgendaItems.agendaItemTitle',
      'Motions.motionType',
      'Motions.motionId',
      'Motions.voteDescription',
      'Motions.dateTime',
      'Motions.committeeSlug',
      'Committees.committeeName',
      'Votes.value',
      'Motions.result',
      'Motions.resultKind',
      'OriginalSummaries.agendaItemSummary',
      sql<string>`CONCAT("Motions"."yesVotes", '-', "Motions"."noVotes")`.as(
        'tally',
      ),
      'aiSummary',
    ])
    .execute();
  const agendaItemByNumber = new Map<string, AgendaItem>();
  for (const {
    agendaItemNumber,
    agendaItemTitle,
    agendaItemSummary,
    aiSummary,
    ...motion
  } of rows) {
    const agendaItem: AgendaItem = agendaItemByNumber.get(agendaItemNumber) ?? {
      agendaItemNumber,
      agendaItemTitle,
      agendaItemSummary,
      aiSummary,
      motions: [],
    };
    agendaItem.motions.push(motion);
    agendaItemByNumber.set(agendaItemNumber, agendaItem);
  }
  return [...agendaItemByNumber.values()];
}
