import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createDB } from '@/database/kyselyDb';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import CouncillorVoteContent from '@/app/councillors/[contactSlug]/components/CouncillorVoteContent';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { Page } from '@/components/ui/page';
import { decisionBodies } from '@/constants/decisionBodies';
import { CURRENT_COUNCIL_TERM } from '@/constants/currentCouncilTerm';

type ParamsType = {
  contactSlug: string;
};

export const revalidate = 3600;

export async function generateStaticParams(): Promise<ParamsType[]> {
  const db = createDB();
  const councillors = await db
    .selectFrom('Councillors')
    .select(['contactSlug'])
    .execute();
  const mayors = await db
    .selectFrom('Mayors')
    .select(['contactSlug'])
    .execute();
  return [...councillors, ...mayors];
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
  if (councillor) return { role: 'Councillor' as const, ...councillor };
  const mayor = await getMayor(db, contactSlug);
  if (mayor) return { role: 'Mayor' as const, ...mayor };

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

  const committees = Object.values(decisionBodies)
    .filter(
      (body) =>
        body.termId === CURRENT_COUNCIL_TERM &&
        //Everyone is already part of council so we don't want to just list "City Council"
        body.decisionBodyPublishLabelCd !== 'COUNCIL' &&
        //Not an ideal matching technique but we get our list of contacts (councillors/mayor) from OpenData (which has no ID) vs the committee data which comes from TMMIS
        body.members.some(
          (m) =>
            `${m.firstName.trim()} ${m.lastName.trim()}` ===
            contact.contactName.trim(),
        ),
    )
    .map((c) => ({
      decisionBodyId: c.decisionBodyId,
      decisionBodyName: c.decisionBodyName,
    }))
    .sort((a, b) => a.decisionBodyName.localeCompare(b.decisionBodyName));

  return (
    <Page>
      <CouncillorBio contact={contact} committees={committees} />
      <CouncillorVoteContent
        currentPage={currentPage}
        contactSlug={contactSlug}
      />
    </Page>
  );
}
