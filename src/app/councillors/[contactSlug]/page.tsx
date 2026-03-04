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

export const revalidate = 3600; // Cache for 1 hour

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

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const db = createDB();
  const councillor = await getCouncillor(db, params.contactSlug);
  if (!councillor) {
    notFound();
  }
  return {
    title: `Voting record for ${councillor.contactName} – Civic Dashboard`,
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
  if (!councillor) {
    notFound();
  }
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio councillor={councillor} />
      <CouncillorVoteContent
        currentPage={currentPage}
        contactSlug={contactSlug}
      />
    </main>
  );
}
