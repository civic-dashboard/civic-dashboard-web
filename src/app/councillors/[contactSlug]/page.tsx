import { Metadata } from 'next';
import { createDB } from '@/database/kyselyDb';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import CouncillorVoteContent from '@/app/councillors/[contactSlug]/components/CouncillorVoteContent';
import { Kysely } from 'kysely';
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

async function getAgendaItems(contactSlug: string) {
  const response = await fetch(
    `http://localhost:3000//api/councillor-items?contactSlug=${contactSlug}&page=1&pageSize=10`,
    {
      method: 'GET',
    },
  );
  const itemCount = Number(response.headers.get('agenda-item-count'));
  const agendaItems = (await response.json()) as AgendaItem[];

  return {
    agendaItems,
    itemCount,
  };
}

export default async function CouncillorVotePage(props: {
  searchParams: { page?: string };
  params: Promise<ParamsType>;
}) {
  const currentPage = parseInt(props.searchParams.page || '1', 10);
  const { contactSlug } = await props.params;

  const db = createDB();
  const councillor = await getCouncillor(db, contactSlug);

  const { agendaItems, itemCount } = await getAgendaItems(contactSlug);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio councillor={councillor} />
      <CouncillorVoteContent
        currentPage={currentPage}
        itemCount={itemCount}
        agendaItems={agendaItems}
        contactSlug={contactSlug}
      />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const db = createDB();
  const councillor = await getCouncillor(db, params.contactSlug);

  return {
    title: `Voting record for ${councillor.contactName} – Civic Dashboard`,
  };
}
