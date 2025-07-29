import { Metadata } from 'next';
import { notFound } from 'next/navigation'
import { FullPageAgendaItemCard } from '@/components/AgendaItemCard';
import { decisionBodies } from '@/constants/decisionBodies';
import { createDB } from '@/database/kyselyDb';
import { getAgendaItemByReference } from '@/database/queries/agendaItems';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const db = createDB();
  const { reference } = await params;
  const agendaItem = await getAgendaItemByReference(db, reference);

  if (!agendaItem) {
    return {};
  }

  return {
    title: `${agendaItem.reference} - ${agendaItem.agendaItemTitle} – Civic Dashboard`,
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
  const agendaItem = await getAgendaItemByReference(db, reference);

  if (!agendaItem) {
    notFound();
  }

  return (
    <div className="m-auto sm:max-w-max-content-width sm:p-8">
      <FullPageAgendaItemCard
        decisionBody={decisionBodies[agendaItem.decisionBodyId]}
        item={agendaItem}
      />
    </div>
  );
}
