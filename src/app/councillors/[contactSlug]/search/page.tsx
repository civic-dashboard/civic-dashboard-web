import { createDB } from '@/database/kyselyDb';
import { getVotesByAgendaItemsForContact } from '@/database/queries/councillorVotes';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';
import AgendaItemResults from '@/app/councillors/[contactSlug]/components/AgendaItemResults';

type ParamsType = {
  contactSlug: string;
};

export default async function CouncillorVotePage(props: {
  params: Promise<ParamsType>;
  searchParams: Promise<Record<string, undefined | string | string[]>>;
}) {
  const { contactSlug } = await props.params;
  // Todo: Zod-check
  const searchParams = await props.searchParams;

  const searchString = searchParams['searchString'];
  if (typeof searchString !== 'string') throw new Error(`Invalid searchString`);

  const agendaItems = await getVotesByAgendaItemsForContact(
    createDB(),
    contactSlug,
    searchString,
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio contactSlug={contactSlug} />
      <AgendaItemResults agendaItems={agendaItems} searchTerm="" />
    </main>
  );
}
