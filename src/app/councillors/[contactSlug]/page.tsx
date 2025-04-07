import { createDB } from '@/database/kyselyDb';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import CouncillorVoteContent from '@/app/councillors/[contactSlug]/components/CouncillorVoteContent';
import { Kysely, sql } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { AgendaItem } from '@/app/councillors/[contactSlug]/types';
import { nestMotionsUnderAgendaItems } from '@/database/queries/councillorVotes';

type ParamsType = {
  contactSlug: string;
};

export async function generateStaticParams(): Promise<ParamsType[]> {
  return await createDB()
    .selectFrom('Councillors')
    .select(['contactSlug'])
    .execute();
}

async function getVotesByAgendaItemsForContact(
  db: Kysely<DB>,
  contactSlug: string,
): Promise<AgendaItem[]> {
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
    .orderBy('Motions.dateTime', 'desc')
    .select([
      'AgendaItems.agendaItemNumber',
      'AgendaItems.agendaItemTitle',
      'Motions.motionType',
      'Motions.motionId',
      'Motions.voteDescription',
      'Motions.dateTime',
      'Motions.committeeSlug',
      'Motions.result',
      'Motions.resultKind',
      sql<string>`CONCAT("Motions"."yesVotes", '-', "Motions"."noVotes")`.as(
        'tally',
      ),
      'Votes.value',
      'Committees.committeeName',
      'OriginalSummaries.agendaItemSummary',
      'AutoSummaries.aiSummary',
    ])
    .execute();

  return nestMotionsUnderAgendaItems(rows);
}

export default async function CouncillorVotePage(props: {
  params: Promise<ParamsType>;
}) {
  const { contactSlug } = await props.params;
  const db = createDB();
  const agendaItems = await getVotesByAgendaItemsForContact(db, contactSlug);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio contactSlug={contactSlug} />
      <CouncillorVoteContent agendaItems={agendaItems} />
    </main>
  );
}
