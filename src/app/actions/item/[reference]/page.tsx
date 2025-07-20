import { Metadata } from 'next';
import { FullPageAgendaItemCard } from '@/components/AgendaItemCard';
import { decisionBodies } from '@/constants/decisionBodies';
import { createDB } from '@/database/kyselyDb';
import { getAgendaItemByReference } from '@/database/queries/agendaItems';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const db = createDB();
  const { reference } = await params;
  const agendaItem = await getAgendaItemByReference(db, reference);

  if (!agendaItem) {
    return {
      title: 'Civic Dashboard',
    };
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
    return (
      <main className="p-12 min-h-[500]">
        <h1>We couldn't find that agenda item</h1>
      </main>
    );
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
