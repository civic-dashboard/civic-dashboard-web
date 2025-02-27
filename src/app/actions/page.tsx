import { fetchDecisionBodies } from '@/api/decisionBody';
import { fetchAgendaItems } from '@/api/agendaItem';
import { AgendaItemList } from '@/components/AgendaItemList';

export default async function Home() {
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const items = await fetchAgendaItems({ start: now, end: nextMonth });
  const decisionBodies = await fetchDecisionBodies();

  return (
    <div className="min-h-screen flex flex-col items-center">
      <AgendaItemList items={items} decisionBodies={decisionBodies} />
    </div>
  );
}
