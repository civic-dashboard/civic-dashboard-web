import { fetchDecisionBodies } from '@/api/decisionBody';
import { fetchItems } from '@/api/agendaItem';
import { AgendaItemList } from '@/components/AgendaItemList';

export default async function Home() {
  const items = await fetchItems();
  const decisionBodies = await fetchDecisionBodies();

  return (
    <div className="flex flex-col items-center">
      <AgendaItemList items={items} decisionBodies={decisionBodies} />
    </div>
  );
}
