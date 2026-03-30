import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FullPageAgendaItemCard } from '@/components/AgendaItemCard';
import { decisionBodies } from '@/constants/decisionBodies';
import { createDB } from '@/database/kyselyDb';
import {
  getAgendaItemByReference,
  getMotionsWithVotesByReference,
} from '@/database/queries/agendaItems';
import { stripHtmlAndGetFirstParagraph } from '@/logic/sanitize';
import { VotingRecord } from '@/components/VotingRecord';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const db = createDB();
  const { reference } = await params;
  const agendaItem = await getAgendaItemByReference(db, reference);

  if (!agendaItem) {
    return {};
  }

  const fullDescription = stripHtmlAndGetFirstParagraph(
    agendaItem.agendaItemSummary,
  );
  const description =
    fullDescription.length > 200
      ? fullDescription
          .slice(0, 197)
          .trim()
          .replace(/\s+\S+$/, '') + '...'
      : fullDescription;

  return {
    title: `${agendaItem.reference} - ${agendaItem.agendaItemTitle} – Civic Dashboard`,
    ...(description && {
      description,
      openGraph: {
        description,
      },
    }),
  };
}

type Params = {
  reference: string;
};

type Props = {
  params: Promise<Params>;
};
export default async function AgendaItemPage({ params }: Props) {
  const db = createDB();
  const { reference } = await params;
  const [agendaItem, motions] = await Promise.all([
    getAgendaItemByReference(db, reference),
    getMotionsWithVotesByReference(db, reference),
  ]);

  if (!agendaItem) {
    notFound();
  }

  return (
    <div className="m-auto sm:max-w-max-content-width sm:p-8">
      <FullPageAgendaItemCard
        decisionBody={decisionBodies[agendaItem.decisionBodyId]}
        item={agendaItem}
      >
        <VotingRecord motions={motions} />
      </FullPageAgendaItemCard>
    </div>
  );
}
