import { createDB } from '@/database/kyselyDb';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { searchCouncillorVotes } from '@/database/queries/councillorVotes';
import CouncillorBio from '@/app/councillors/[contactSlug]/components/CouncillorBio';

type ParamsType = {
  contactSlug: string;
};

async function getTestSearchResults(
  db: Kysely<DB>,
  contactSlug: string,
  textQuery: string,
) {
  return await searchCouncillorVotes(db, {
    options: { contactSlug, textQuery },
    pagination: { page: 0, pageSize: 100 },
  });
}

export default async function CouncillorVotePage(props: {
  params: Promise<ParamsType>;
  searchParams: Promise<Record<string, undefined | string | string[]>>;
}) {
  const { contactSlug } = await props.params;
  // Todo: Zod-check
  const searchParams = await props.searchParams;
  const db = createDB();

  const textQuery = searchParams['textQuery'];
  if (typeof textQuery !== 'string') throw new Error(`Invalid search`);

  const searchResults = await getTestSearchResults(db, contactSlug, textQuery);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <CouncillorBio contactSlug={contactSlug} />
      <ol>
        {searchResults.results.map((result) => (
          <li key={result.agendaItemNumber}>{result.agendaItemNumber}</li>
        ))}
      </ol>
    </main>
  );
}
