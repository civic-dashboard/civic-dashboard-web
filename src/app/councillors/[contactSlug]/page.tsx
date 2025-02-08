import { db } from '@/database/kyselyDb';

type ParamsType = {
  contactSlug: string;
};

export async function generateStaticParams(): Promise<ParamsType[]> {
  return await db.selectFrom('Contacts').select(['contactSlug']).execute();
}
async function getCouncillor(contactSlug: string) {
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
      'Contacts.photoUrl',
      'Wards.wardName',
    ])
    .where('Councillors.contactSlug', '=', contactSlug)
    .execute();
}

async function getVotesByAgendaItemsForContact(contactSlug: string) {
  return await db
    .selectFrom('Votes')
    .innerJoin('Motions', (eb) =>
      eb
        .onRef('Votes.agendaItemNumber', '=', 'Motions.agendaItemNumber')
        .onRef('Votes.motionId', '=', 'Motions.motionId'),
    )
    .innerJoin('AgendaItems', (eb) =>
      eb.onRef('Votes.agendaItemNumber', '=', 'AgendaItems.agendaItemNumber'),
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
      'Votes.value',
      'Motions.result',
      'Motions.resultKind',
    ])
    .execute();
}

export default async function CouncillorVotePage(props: {
  params: Promise<ParamsType>;
}) {
  const { contactSlug } = await props.params;
  const councillor = await getCouncillor(contactSlug);
  const agendaItems = await getVotesByAgendaItemsForContact(contactSlug);

  return (
    <div>
      <pre>
        <code>{JSON.stringify([councillor, agendaItems], null, 2)}</code>
      </pre>
    </div>
  );
}
