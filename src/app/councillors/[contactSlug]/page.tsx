import { createDB } from '@/database/kyselyDb';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import CouncillorVoteContent from '@/app/councillors/[contactSlug]/components/CouncillorVoteContent';
import { Kysely, sql } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { AgendaItem } from '@/app/councillors/[contactSlug]/types/index';

type ParamsType = {
  contactSlug: string;
};

export async function generateStaticParams(): Promise<ParamsType[]> {
  return await createDB()
    .selectFrom('Councillors')
    .select(['contactSlug'])
    .execute();
}

async function getCouncillor(db: Kysely<DB>, contactSlug: string) {
  return await db
    .selectFrom('Councillors')
    .innerJoin('Contacts', (eb) =>
      eb.onRef('Contacts.contactSlug', '=', 'Councillors.contactSlug'),
    )
    .innerJoin('Wards', (eb) =>
      eb.onRef('Wards.wardSlug', '=', 'Councillors.wardSlug'),
    )
    .select([
      'Councillors.contactSlug',
      'Contacts.contactName',
      'Contacts.email',
      'Contacts.phone',
      'Contacts.photoUrl',
      'Wards.wardName',
      'Wards.wardId',
    ])
    .where('Councillors.contactSlug', '=', contactSlug)
    .executeTakeFirstOrThrow();
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

export default async function CouncillorVotePage(props: {
  params: Promise<ParamsType>;
}) {
  const { contactSlug } = await props.params;
  const db = createDB();
  const councillor = await getCouncillor(db, contactSlug);
  const agendaItems = await getVotesByAgendaItemsForContact(db, contactSlug);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio councillor={councillor} />
      <CouncillorVoteContent agendaItems={agendaItems} />
    </main>
  );
}
