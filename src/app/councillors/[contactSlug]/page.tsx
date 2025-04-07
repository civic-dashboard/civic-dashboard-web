import { createDB } from '@/database/kyselyDb';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import CouncillorVoteContent from '@/app/councillors/[contactSlug]/components/CouncillorVoteContent';

import { getVotesByAgendaItemsForContact } from '@/database/queries/councillorVotes';

type ParamsType = {
  contactSlug: string;
};

export async function generateStaticParams(): Promise<ParamsType[]> {
  return await createDB()
    .selectFrom('Councillors')
    .select(['contactSlug'])
    .execute();
}

export default async function CouncillorVotePage(props: {
  params: Promise<ParamsType>;
}) {
  const { contactSlug } = await props.params;
  const db = createDB();
  const agendaItems = await getVotesByAgendaItemsForContact(
    db,
    contactSlug,
    null,
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio contactSlug={contactSlug} />
      <CouncillorVoteContent agendaItems={agendaItems} />
    </main>
  );
}
