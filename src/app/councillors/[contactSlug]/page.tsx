import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createDB } from '@/database/kyselyDb';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import CouncillorVoteContent from '@/app/councillors/[contactSlug]/components/CouncillorVoteContent';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';

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
    .executeTakeFirst();
}

async function getMayor(db: Kysely<DB>, contactSlug: string) {
  return await db
    .selectFrom('Mayors')
    .innerJoin('Contacts', (eb) =>
      eb.onRef('Contacts.contactSlug', '=', 'Mayors.contactSlug'),
    )
    .select([
      'Contacts.contactSlug',
      'contactName',
      'phone',
      'photoUrl',
      'email',
    ])
    .where('Mayors.contactSlug', '=', contactSlug)
    .executeTakeFirst();
}
async function getCouncillorOrMayor(db: Kysely<DB>, contactSlug: string) {
  const councillor = await getCouncillor(db, contactSlug);
  if (councillor) return { role: 'councillor' as const, ...councillor };
  const mayor = await getMayor(db, contactSlug);
  if (mayor) return { role: 'mayor' as const, ...mayor };

  throw new Error(`Unable to find councillor or mayor ${contactSlug}`);
}

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const db = createDB();
  const contact = await getCouncillorOrMayor(db, params.contactSlug);
  if (!contact) {
    notFound();
  }
  return {
    title: `Voting record for ${contact.contactName} – Civic Dashboard`,
  };
}
export default async function CouncillorVotePage(props: {
  searchParams: { page?: string };
  params: Promise<ParamsType>;
}) {
  const currentPage = parseInt(props.searchParams.page || '1', 10);
  const { contactSlug } = await props.params;

  const db = createDB();
  const contact = await getCouncillorOrMayor(db, contactSlug);
  if (!contact) {
    notFound();
  }
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio contact={contact} />
      <CouncillorVoteContent
        currentPage={currentPage}
        contactSlug={contactSlug}
      />
    </main>
  );
}
